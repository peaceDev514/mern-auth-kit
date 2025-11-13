import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest("/auth/me");
        setUser(data.user);
      } catch (err) {
        toast.error("Session expired!");
        navigate("/login");
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
        <p className="text-gray-500">{user?.email}</p>
        <button
          onClick={logout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
