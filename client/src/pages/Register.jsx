import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const API = import.meta.env.VITE_API_URL;

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${VITE_API_URL}/api/auth/register`, {
	      method: "POST",
	      headers: {
		      "Content-type": "application/json"
	      },
	      body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if(!res.ok){
	      throw new Error(data.message);
      }
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
	onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
