import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';
require("dotenv").config();

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        // create a hased token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, 
                {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

            var transport = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: "api",
                pass: "6c7b9d9154ccd42c318883e9db109529",
            },
            });


        const mailOptions = {
          from: "support@demomailtrap.com",
          to: email,
          subject:
            emailType === "VERIFY"
              ? "Verify your email"
              : "Reset your password",
          html: `<p>Click <a href="${
            process.env.DOMAIN
          }/verifyemail?token=${hashedToken}">here</a> to ${
            emailType === "VERIFY" ? "verify your email" : "reset your password"
          }
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verifyemail?token=${hashedToken}
            </p>`,
        };
        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}