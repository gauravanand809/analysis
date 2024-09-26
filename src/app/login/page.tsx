"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login successful");
      router.push("/profile");
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error(error.message);
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

        <form>
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
            onClick={onLogin}
            disabled={buttonDisabled}
            className={`w-full p-3 bg-blue-600 text-white rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              buttonDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Social Login Buttons */}
        <div className="flex flex-col mt-4">
          <button
            // onClick={handleGoogleLogin}
            className="w-full p-3 bg-red-600 text-white rounded-lg mt-4 transition duration-300 ease-in-out transform hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Login with Google
          </button>

          <button
            // onClick={handleGithubLogin}
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
