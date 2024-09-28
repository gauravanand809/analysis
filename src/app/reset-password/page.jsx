// app/reset-password/page.jsx

"use client"; // Mark this component as a Client Component

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams

const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // Use useSearchParams to get query params
    const token = searchParams.get('token'); // Extract token from URL

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); // Added loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(token);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!token) {
            setError("Token is missing from the URL.");
            return;
        }

        try {
            setLoading(true); // Start loading state
            const response = await fetch('/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Password reset successfully!");
                // Redirect to login page after a successful reset
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Reset Password
                </h1>
                <hr className="mb-6" />

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}

                <form onSubmit={handleSubmit}>
                    <label
                        htmlFor="new-password"
                        className="block text-gray-700 font-semibold mb-2"
                    >
                        New Password
                    </label>
                    <input
                        className="p-3 w-full border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        required
                    />

                    <label
                        htmlFor="confirm-password"
                        className="block text-gray-700 font-semibold mb-2"
                    >
                        Confirm Password
                    </label>
                    <input
                        className="p-3 w-full border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        required
                    />

                    <button
                        type="submit"
                        className={`w-full p-3 bg-blue-600 text-white rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300`}
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordPage;
