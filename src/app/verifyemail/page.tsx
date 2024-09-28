"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to verify the user's email
  const verifyUserEmail = async (token: string) => {
    if (!token) return;

    setLoading(true);

    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setError(true);
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail(token);
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 p-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center transition-transform duration-500 transform hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Verify Your Email
        </h1>
        <hr className="mb-6 border-gray-300" />

        {!loading && !verified && !error && (
          <h2 className="p-3 bg-yellow-500 text-white rounded-lg inline-block mb-6 shadow-md">
            Check your email to verify your account.
          </h2>
        )}

        {loading && (
          <div className="flex flex-col items-center">
            <div className="loader mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-700">Verifying...</h2>
          </div>
        )}

        {verified && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Email Verified Successfully!
            </h2>
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out"
            >
              Go to Login
            </Link>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold bg-red-500 text-white py-2 px-4 rounded-lg shadow-md">
              Error Verifying Email
            </h2>
          </div>
        )}
      </div>

      {/* CSS styles */}
      <style jsx>{`
        .loader {
          border: 8px solid rgba(255, 255, 255, 0.2);
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
