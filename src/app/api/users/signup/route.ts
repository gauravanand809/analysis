// app/api/users/signup/route.ts

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        console.log("Signup Request Body:", reqBody);

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log("Saved User:", savedUser);
        console.log("Sending verification email to:", email);

        // Send verification email
        await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });

        return NextResponse.json({
            message: "User created successfully. Please check your email to verify your account.",
            success: true,
            // Do not send `savedUser` back to the client for security reasons
        });

    } catch (error: any) {
        console.error("Error in signup route:", error); // Detailed error log
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
