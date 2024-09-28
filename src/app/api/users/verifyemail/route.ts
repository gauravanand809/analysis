import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
    try {
        // Extract the token from the request body
        const reqBody = await request.json();
        const { token } = reqBody;

        // Log the token for debugging
        console.log("Verification token received:", token);

        // Find the user with the provided token and ensure it's not expired
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        // Check if a user was found
        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Update user verification status
        user.isVerified = true;
        user.verifyToken = undefined; // Clear the verification token
        user.verifyTokenExpiry = undefined; // Clear the expiration time
        await user.save();

        // Return success response
        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error verifying email:", error.message); // Log error message for debugging
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
