import { useState } from "react";
import axios from "axios";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/request-password-reset",
        {
          email,
        }
      );
      setMessage("Password reset link sent to your email");
    } catch (err: any) {
      setError("Failed to send password reset link");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-center text-white">
          Request Password Reset
        </h1>
        {message && (
          <p className="mb-4 text-center text-green-500">{message}</p>
        )}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input      
              type="email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Request Password Reset
          </button>
        </form>
      </div>
    </div>
  );
}
