import axios from 'axios';
import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email.service';
import { EmailResponseDto } from './dto/EmailResponse.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get(':filePath')
  async getEmailData(
    @Param('filePath') filePath: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const decodedFilePath = decodeURIComponent(filePath);
      const emailData = await this.emailService.parseEmail(decodedFilePath);
      const jsonAttachment = this.findJsonAttachment(emailData);

      if (jsonAttachment) {
        this.respondWithJsonAttachment(res, jsonAttachment);
      } else {
        const content = emailData.text || emailData.html;
        await this.respondWithJsonUrl(res, content);
      }
    } catch (error) {
      this.handleErrorResponse(res, error);
    }
  }

  private findJsonAttachment(emailData: any): any | null {
    return (
      emailData.attachments?.find(
        (attachment) => attachment.contentType === 'application/json',
      ) || null
    );
  }

  private respondWithJsonAttachment(res: Response, jsonAttachment: any): void {
    res.set('Content-Type', 'application/json');
    res.set(
      'Content-Disposition',
      `attachment; filename=${jsonAttachment.filename}`,
    );
    res.send(jsonAttachment.content.toString('utf-8'));
  }

  private async respondWithJsonUrl(
    res: Response,
    content: string | false | null,
  ): Promise<void> {
    if (typeof content === 'string' && content) {
      const match = content.match(/https?:\/\/[^\s]+\/comments[^\w\S]*/);
      const jsonUrl = match ? match[0].replace(/\s+/g, '') : null;

      if (jsonUrl) {
        try {
          const response = await axios.get(jsonUrl);
          if (response.data) {
            const jsonResponse = new EmailResponseDto(response.data);
            res.json(jsonResponse);
          } else {
            throw new NotFoundException('JSON not found at the provided URL.');
          }
        } catch (error) {
          this.handleErrorResponse(res, error);
        }
      } else {
        throw new HttpException(
          'Failed to extract JSON URL from the email.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      res.json({ jsonWebpageLink: 'http://example.com/path-to-json' });
    }
  }

  private handleErrorResponse(res: Response, error: any): void {
    if (error instanceof HttpException) {
      res.status(error.getStatus()).json({ error: error.message });
    } else {
      console.error('Unexpected error:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Unexpected error occurred.' });
    }
  }
}
