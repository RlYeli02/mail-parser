// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { simpleParser, ParsedMail } from 'mailparser';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  async parseEmail(filePath: string): Promise<ParsedMail> {
    const emailData = await simpleParser(fs.createReadStream(filePath));
    return emailData;
  }
}
