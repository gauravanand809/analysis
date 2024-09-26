"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  // Function to verify the user's email
  const verifyUserEmail = async (token: string) => {
    if (!token) return; // Exit if token is not provided

    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token"); // Use URLSearchParams for better readability
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail(token); 
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 py-10 px-4">
      <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Verify Your Email
        </h1>
        <hr className="mb-6 border-gray-300" />

        <h2 className="p-3 bg-orange-500 text-white rounded-lg inline-block mb-6">
          {token ? `Token: ${token}` : "No token found"}
        </h2>

        {verified && (
          <div>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Email Verified Successfully!
            </h2>
            <Link href="/login">
              <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out">
                Go to Login
              </a>
            </Link>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold bg-red-500 text-white py-2 px-4 rounded-lg">
              Error Verifying Email
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
