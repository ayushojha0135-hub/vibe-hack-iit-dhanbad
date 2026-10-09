import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const getToken = () => localStorage.getItem("pitr_token");
export const setToken = (t) => (t ? localStorage.setItem("pitr_token", t) : localStorage.removeItem("pitr_token"));

export const http = axios.create({ baseURL: API });
http.interceptors.request.use((c) => {
  const t = getToken();
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

export function errMsg(e) {
  const d = e?.response?.data?.detail;
  if (!d) return e?.message || "Kuch toh gadbad hai, matey!";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg || "").filter(Boolean).join(" ");
  return String(d?.msg || d);
}

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -64, duration: 1.8 });
  else el.scrollIntoView({ behavior: "smooth" });
}
