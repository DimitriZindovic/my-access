const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erreur réseau" }));
    throw new Error(error.error || "Une erreur est survenue");
  }

  return response.json();
}

// Auth API
export const authApi = {
  signup: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    handicapType?: string;
  }) => api<{
    message: string;
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      handicapType: string | null;
    };
    session?: {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    };
  }>("/api/auth/signup", { method: "POST", body: data }),

  login: (data: { email: string; password: string }) =>
    api<{
      user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        handicapType: string | null;
      };
      session: {
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
      };
    }>("/api/auth/login", { method: "POST", body: data }),

  logout: (token: string) =>
    api<{ message: string }>("/api/auth/logout", { method: "POST", token }),

  me: (token: string) =>
    api<{
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      handicapType: string | null;
      createdAt: string;
    }>("/api/auth/me", { token }),

  updateProfile: (
    token: string,
    data: {
      firstName?: string;
      lastName?: string;
      handicapType?: string;
      phone?: string;
    }
  ) => api<unknown>("/api/auth/me", { method: "PUT", body: data, token }),

  refresh: (refreshToken: string) =>
    api<{
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    }>("/api/auth/refresh", { method: "POST", body: { refreshToken } }),
};

// Centers API
export const centersApi = {
  list: (params?: { search?: string; verified?: boolean; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.verified) searchParams.set("verified", "true");
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());
    
    const query = searchParams.toString();
    return api<unknown[]>(`/api/centers${query ? `?${query}` : ""}`);
  },

  get: (id: string) => api<unknown>(`/api/centers/${id}`),

  addReview: (id: string, data: { rating: number; comment?: string }, token: string) =>
    api<unknown>(`/api/centers/${id}/reviews`, { method: "POST", body: data, token }),
};
