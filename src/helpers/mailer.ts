
// helpers/mailer.ts

import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const token = crypto.randomBytes(32).toString('hex');

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: token,
                verifyTokenExpiry: Date.now() + 3600000, // 1 hour
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
            });
        }

        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

    const verificationUrl = `http://${process.env.DOMAIN}/reset-password?token=${token}`;


        const mailOptions = {
            from: "support@feedback360.xyz",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `<p>Click <a href="${verificationUrl}">here</a> to ${
                emailType === "VERIFY" ? "verify your email" : "reset your password"
            }, or copy and paste the link below in your browser.<br/>${verificationUrl}</p>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        console.log("Mail response:", mailResponse); // Log the mail response
        return mailResponse;

    } catch (error: any) {
        console.error("Error in sendEmail:", error);
        throw new Error(error.message);
    }
};
