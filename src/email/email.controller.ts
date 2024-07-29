import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send')
  async sendEmail(@Body() body: { to: string, emailKey: string, data: Record<string, string>, bcc?: string }) {
    await this.emailService.sendTemplatedEmail(body.to, body.emailKey, body.data, body.bcc);
    return { message: 'Email sent successfully' };
  }
}
