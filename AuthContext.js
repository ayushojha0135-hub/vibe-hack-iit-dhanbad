import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { http, getToken, setToken } from "@/lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null checking, false logged out

  useEffect(() => {
    if (!getToken()) { setUser(false); return; }
    http.get("/auth/me").then((r) => setUser(r.data)).catch(() => { setToken(null); setUser(false); });
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await http.post("/auth/login", { email, password });
    setToken(data.token);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await http.post("/auth/register", payload);
    setToken(data.token);
    return data.user;
  }, []);

  const logout = useCallback(() => { setToken(null); setUser(false); }, []);

  return <AuthCtx.Provider value={{ user, setUser, login, register, logout }}>{children}</AuthCtx.Provider>;
}
