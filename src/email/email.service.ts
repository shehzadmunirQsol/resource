import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly db: DatabaseService) {}
  async getEmailTemplate(payload: string) {
    console.log({ payload });
    const options: any = {
      where: {
        email_key: payload,
      },
    };
    const email = await this.db.emailTemplate.findFirst({
      ...options,
    });

    return { email };
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
    bcc: string = '',
  ): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: `${process.env.MAIL_HOST}`,
        port: 465,
        secure: true,
        auth: {
          user: `${process.env.MAIL_USERNAME}`,
          pass: `${process.env.MAIL_PASSWORD}`,
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates
        },
      });
      console.log({ host: process.env.MAIL_HOST });

      const mailOptions = {
        from: `${process.env.MAIL_USERNAME}`,
        to,
        bcc,
        subject,
        html: body,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log({ error });
    }
  }

  async sendTemplatedEmail(
    to: string,
    emailKey: string,
    data: Record<string, string>,
    bcc: string = '',
  ): Promise<void> {
    const emailTemplate = await this.getEmailTemplate(emailKey);

    console.log({ emailKey, emailTemplate });
    if (!emailTemplate) {
      throw new Error('Email template not found');
    }

    const subject = replacePlaceholders(emailTemplate.email.subject, data);
    const body = replacePlaceholders(emailTemplate.email.body, data);
    console.log({ body, data });
    await this.sendEmail(to, subject, body, bcc);
  }
}

export function replacePlaceholders(
  template: string,
  data: Record<string, string>,
): string {
  return template.replace(
    /\[([A-Za-z_]+)\]/g,
    (_, key) => data[key.toLowerCase()] || '',
  );
}
