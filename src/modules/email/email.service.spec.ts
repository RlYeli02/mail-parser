import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseEmail', () => {
    it('should parse email successfully', async () => {
      const emailFilePath =
        '/Users/franyelizacodeait/Desktop/mailer/mailer-parse/mailer-parse/emailWithJsonAttachment.eml';
      const parsedEmail = await service.parseEmail(emailFilePath);

      expect(parsedEmail).toBeDefined();
      expect(parsedEmail.subject).toEqual(expect.any(String));
    });

    it('should handle parsing errors', async () => {
      const invalidEmailFilePath = 'franyeliza/wrong/path.eml';

      await expect(service.parseEmail(invalidEmailFilePath)).rejects.toThrow();
    });
  });
});
