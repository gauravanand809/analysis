import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { getSession } from "next-auth/react";
import { cookies } from "next/headers"; // Using Next.js cookies API

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
  callbacks: {
    async session({ session, token }) {
      // Here you can set the cookie after the session is created
      // The token from NextAuth JWT can be passed into the cookie if needed
      const cookieStore = cookies();
      cookieStore.set("token", token, {
        path: "/",
        httpOnly: true, // Prevent access via JavaScript
        secure: process.env.NODE_ENV === "production", // Only HTTPS in production
        sameSite: "lax", // Cross-site cookie policy
      });
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect logic based on verification status
      const session = await getSession();
      console.log(session);
      return url.startsWith(baseUrl) ? `${baseUrl}/profile` : baseUrl;
    },
  },

  cookies: {
    // Optionally, configure NextAuth cookies here as well if you need specific settings
    token: {
      name: "next-auth.session-token", // Custom cookie name
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
