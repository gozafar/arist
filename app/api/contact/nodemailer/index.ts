import nodemailer, { type Transporter, type SendMailOptions } from 'nodemailer';
import { envs } from '../../../../configs/env';

const {
  isProduction,
  appName,
  email: { host, port, user, password },
} = envs;

interface TEmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
}

export interface TEmailMessage {
  to: string[] | string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: TEmailAttachment[];
}

class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false, //true for 465 port, false for other ports
      auth: {
        user,
        pass: password,
      },
    });
  }

  send = async ({ to, cc = [], bcc = [], subject, text, html, attachments = [] }: TEmailMessage): Promise<void> => {
    try {
      const mailOptions: SendMailOptions = {
        from: `"${appName}" <${user}>`,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('================', info);
      if (!isProduction) console.log('Email sent successfully via nodemailer', info.response);
    } catch (error) {
      console.log('Error sending email via nodemailer', error);
      throw new Error('Error sending email via nodemailer');
    }
  };
}

export const emailService = new EmailService();
