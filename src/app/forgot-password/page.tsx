"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    setLoading(true);

    try {
      const response = await axios.post("/api/users/forgot-password", { email });
      toast.success(response.data.message); // Show success message
      router.push("/login"); // Redirect to login after sending reset email
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data.error || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Reset Password
        </h1>
        <hr className="mb-6" />

        <form onSubmit={handleForgotPassword}>
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-2"
          >
            Enter your email to reset your password
          </label>
          <input
            className="p-3 w-full border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            className={`w-full p-3 bg-blue-600 text-white rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <button
          onClick={() => router.push("/login")}
          className="mt-4 text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
