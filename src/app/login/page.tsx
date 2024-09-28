"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Import signIn for social logins
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const onLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    setLoading(true);

    try {
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);

      // Assuming the response contains a token and verification status
      if (response.data.token) {
        document.cookie = `token=${response.data.token}; path=/;`; // Store token in cookie
      }

      const isVerified = response.data.users.isVerified;
      console.log(isVerified);

      // Check if the email is verified
      if (isVerified === true) {
        toast.success("Login successful");
        router.push("/profile"); // Redirect to profile if verified
      } else {
        // Redirect to verification page and send verification email
        toast.success(
          "Please verify your email. A verification email has been sent."
        );
        // Use router.push to handle navigation in Next.js
        router.push("/verifyemail"); // Redirect to email verification page
      }
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error(error.response?.data.error || "Login failed"); // Use specific error message from API if available
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    setLoading(true);

    try {
      const response = await axios.post("/api/users/forgot-password", {
        email: forgotPasswordEmail,
      });
      toast.success(response.data.message); // Show success message
      setShowForgotPassword(false); // Hide the modal or form
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data.error || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {loading ? "Processing..." : "Login"}
        </h1>
        <hr className="mb-6" />

        {/* Email/Password Login Form */}
        <form onSubmit={onLogin}>
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-2"
          >
            Email
          </label>
          <input
            className="p-3 w-full border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            required
          />

          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mb-2"
          >
            Password
          </label>
          <input
            className="p-3 w-full border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            required
          />

          <button
            type="submit" // Use type="submit" to trigger form submission
            disabled={buttonDisabled}
            className={`w-full p-3 bg-blue-600 text-white rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              buttonDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password Link */}
        <p className="mt-4 text-center text-gray-600">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </p>

        {/* Social Login Buttons */}
        <div className="flex flex-col mt-4">
          {/* Google Login Button */}
          <button
            onClick={() => {
              setLoading(true);
              signIn("google", { callbackUrl: "/profile" })
                .then(() => {
                  router.push("/profile"); // Force redirect to profile
                })
                .catch((error) => {
                  console.error("Google login error:", error);
                  toast.error(
                    "Failed to log in with Google. Please try again."
                  );
                })
                .finally(() => setLoading(false));
            }}
            className="w-full p-3 bg-red-600 text-white rounded-lg mt-4 transition duration-300 ease-in-out transform hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Login with Google
          </button>
          {/* GitHub Login */}
          <button
            onClick={() => signIn("github", { callbackUrl: "/profile" })} // Trigger GitHub sign-in
            className="w-full p-3 bg-green-600 text-white rounded-lg mt-4 transition duration-300 ease-in-out transform hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Login with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
