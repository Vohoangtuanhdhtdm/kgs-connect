import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface User {
  name: string;
  email: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("kgs_token");
    const savedUser = localStorage.getItem("kgs_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("kgs_token");
        localStorage.removeItem("kgs_refreshToken");
        localStorage.removeItem("kgs_user");
      }
    }
  }, []);

  const login = useCallback(
    (token: string, refreshToken: string, user: User) => {
      setToken(token);
      setUser(user);
      localStorage.setItem("kgs_token", token);
      localStorage.setItem("kgs_refreshToken", refreshToken);
      localStorage.setItem("kgs_user", JSON.stringify(user));
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("kgs_token");
    localStorage.removeItem("kgs_refreshToken");
    localStorage.removeItem("kgs_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
