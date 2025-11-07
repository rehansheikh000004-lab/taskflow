export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
export function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}
