import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { getSession } from "next-auth/react";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks:  {
  async redirect({ url, baseUrl }) {
    // Redirect logic based on verification status
    const session = await getSession(); // Fetch session to check verification status

    // If you want to check if the user is verified, uncomment below
    // if (session && !session.user.isVerified) {
    //   return `${baseUrl}/verifyemail`; // Redirect to verification page if not verified
    // }

    return url.startsWith(baseUrl) ? `${baseUrl}/profile` : baseUrl; // Redirect to profile if verified
  },
},

  cookies: {
    // Configure the cookies if you need specific settings
    sessionToken: {
      name: "next-auth.session-token", // Custom cookie name
      options: {
        httpOnly: true, // Ensure cookie is not accessible via JavaScript
        secure: process.env.TOKEN_SECRET === "production", // Use secure cookies in production
        sameSite: "lax", // Adjust according to your needs
        path: "/", // Accessible on all routes
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
