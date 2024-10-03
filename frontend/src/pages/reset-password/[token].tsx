import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { token } = router.query; // Extract the token from the URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid token");
      return;
    }

    try {
      // Send the new password along with the token to the backend
      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        router.push("/login"); // Redirect to login after success
      }, 2000);
    } catch (err: any) {
      // Improved error handling for better feedback to the user
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Show specific error from backend
      } else {
        setError("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-center text-white">
          Reset Password
        </h1>
        {message && (
          <p className="mb-4 text-center text-green-500">{message}</p>
        )}
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
