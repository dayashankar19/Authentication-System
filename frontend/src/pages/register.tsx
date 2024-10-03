import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [error, setError] = useState<string>(""); // To show generic errors
  const [passwordError, setPasswordError] = useState<string>(""); // To show password-specific errors
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setPasswordError(""); // Clear password error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      router.push("/login");
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      }

      if (err.response?.data?.message?.includes("Password")) {
        setPasswordError(
          "Password must be 8-20 characters long and include an uppercase, lowercase letter, a digit, and a special character."
        );
      } else {
        setPasswordError(""); // Reset password error if it's not password related
      }
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6 relative">
      {/* Login Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLoginClick}
          className="py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Login
        </button>
      </div>

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Register
        </h1>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type={showPassword ? "text" : "password"} // Toggle between "password" and "text"
              className={`w-full px-4 py-2 border ${
                passwordError ? "border-red-500" : "border-gray-600"
              } bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            {passwordError && (
              <p className="text-red-500 mt-2 text-sm">{passwordError}</p>
            )}
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2 cursor-pointer"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)} // Toggle state
            />
            <label
              htmlFor="showPassword"
              className="text-white cursor-pointer select-none"
            >
              Show Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
