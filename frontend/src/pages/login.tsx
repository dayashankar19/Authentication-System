import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link"; // Import Link from Next.js

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
      {/* register button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleRegisterClick}
          className="py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Register
        </button>
      </div>
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h1>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
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
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
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

          {/* Add "Forgot Password?" link without <a> */}
          <div className="mb-6 text-center">
            <Link
              href="/request-password-reset"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
