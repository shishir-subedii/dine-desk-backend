// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
    ) {}

    // Send custom mail (free-form HTML)
    async sendCustomMail(to: string, subject: string, content: string) {
        await this.mailerService.sendMail({
            to,
            subject,
            template: 'custom', // points to src/mail/templates/custom.hbs
            context: {
                subject,  // used in <title> of template
                content,  // injected into {{content}} inside the template
            },
        });
    }


    // OTP for signup (email verification)
    async sendSignupOtp(email: string, name: string, otp: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Verify your account - OTP',
            template: 'signup-otp',
            context: {
                subject: 'Verify your account',
                title: 'Email Verification',
                name,
                otp: process.env.APP_ENV === 'production' ? otp : '123456',
                action: 'verify your account',
                expiry: 10, // minutes
            },
        });
    }

    // OTP for forgot password
    async sendForgotPasswordOtp(email: string, name: string, otp: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Reset your password - OTP',
            template: 'forgot-password-otp',
            context: {
                subject: 'Password Reset',
                title: 'Forgot Password Request',
                name,
                otp: process.env.APP_ENV === 'production' ? otp : '123456',
                action: 'reset your password',
                expiry: 10, // minutes
            },
        });
    }
}
