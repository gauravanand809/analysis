// app/api/users/forgot-password/route.ts

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer"; // Import your sendEmail function

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    // Validate the email input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    // Send the email using the sendEmail function
    await sendEmail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json({ message: "Reset email sent successfully" });

  } catch (error: any) {
    console.error("Error in forgot-password API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
