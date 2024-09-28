// helpers/mailer.ts

import nodemailer from "nodemailer";
import User from "@/models/userModel";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    // Update user with token and expiry based on the email type
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
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${
                      emailType === "VERIFY"
                        ? "Verify Your Email"
                        : "Reset Your Password"
                    }</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 0;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            margin: 20px;
                        }
                        .button-container {
                            text-align: center;
                            margin-top: 30px;
                        }
                        .button {
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            text-decoration: none;
                            font-size: 16px;
                        }
                        .button:hover {
                            background-color: #45a049;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 40px;
                            color: #888888;
                            font-size: 12px;
                        }
                        .link-box {
                            background-color: #f8f8f8;
                            padding: 10px;
                            border-radius: 4px;
                            word-wrap: break-word;
                            font-size: 14px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>${
                              emailType === "VERIFY"
                                ? "Verify Your Email"
                                : "Reset Your Password"
                            }</h2>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>
                                Click the button below to ${
                                  emailType === "VERIFY"
                                    ? "verify your email"
                                    : "reset your password"
                                }.
                            </p>
                            <div class="button-container">
                                <a href="${verificationUrl}" class="button">
                                    ${
                                      emailType === "VERIFY"
                                        ? "Verify Email"
                                        : "Reset Password"
                                    }
                                </a>
                            </div>
                            <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                            <div class="link-box">
                                ${verificationUrl}
                            </div>
                        </div>
                        <div class="footer">
                            <p>If you did not request this, please ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Mail response:", mailResponse); // Log the mail response
    return mailResponse;
  } catch (error: any) {
    console.error("Error in sendEmail:", error);
    throw new Error(error.message);
  }
};
