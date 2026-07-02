import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem("auth_token"); } catch { return null; }
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) { setUser(null); return; }
    setIsLoading(true);
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data || null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [token]);

  const login = (newToken: string) => {
    try { localStorage.setItem("auth_token", newToken); } catch {}
    setToken(newToken);
  };

  const logout = () => {
    try { localStorage.removeItem("auth_token"); } catch {}
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: isLoading && !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
