import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Dashboard() {
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage(res.data.message);
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
        <p className="mb-4 text-lg text-gray-300">
          {message ? message : "Loading..."}
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
