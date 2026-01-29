"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  handicapType: string | null;
}

interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    handicapType?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    handicapType?: string;
    phone?: string;
  }) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la session depuis le localStorage
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = localStorage.getItem(STORAGE_KEY);
        if (storedSession) {
          const parsedSession: Session = JSON.parse(storedSession);
          
          // Vérifier si le token n'est pas expiré
          if (parsedSession.expiresAt * 1000 > Date.now()) {
            setSession(parsedSession);
            
            // Récupérer les infos utilisateur
            const userData = await authApi.me(parsedSession.accessToken);
            setUser(userData);
          } else {
            // Token expiré, essayer de le rafraîchir
            try {
              const newSession = await authApi.refresh(parsedSession.refreshToken);
              setSession(newSession);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
              
              const userData = await authApi.me(newSession.accessToken);
              setUser(userData);
            } catch {
              // Refresh échoué, déconnecter
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error("Erreur chargement session:", error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setUser(data.user);
    setSession(data.session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.session));
  }, []);

  const signup = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      handicapType?: string;
    }) => {
      const result = await authApi.signup(data);
      setUser(result.user);
      if (result.session) {
        setSession(result.session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.session));
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      if (session?.accessToken) {
        await authApi.logout(session.accessToken);
      }
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const updateProfile = useCallback(
    async (data: {
      firstName?: string;
      lastName?: string;
      handicapType?: string;
      phone?: string;
    }) => {
      if (!session?.accessToken) {
        throw new Error("Non authentifié");
      }

      await authApi.updateProfile(session.accessToken, data);
      
      // Recharger les infos utilisateur
      const userData = await authApi.me(session.accessToken);
      setUser(userData);
    },
    [session]
  );

  const refreshSession = useCallback(async () => {
    if (!session?.refreshToken) {
      throw new Error("Pas de refresh token");
    }

    const newSession = await authApi.refresh(session.refreshToken);
    setSession(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
        login,
        signup,
        logout,
        updateProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
