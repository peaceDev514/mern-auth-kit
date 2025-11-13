const API = import.meta.env.VITE_API_URL;
const API_BASE = `${API}/api`;
export async function apiRequest(endpoint, method = "GET", data) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (data) options.body = JSON.stringify(data);

  const token = localStorage.getItem("token");
  if (token) options.headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json;
}
