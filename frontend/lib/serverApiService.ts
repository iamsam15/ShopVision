import { cookies } from "next/headers";
import { Tenant } from "./clientApiService";

// Assuming you have a User type defined in clientApiService as well
import { User } from "./clientApiService";

const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = `${API_HOST}/api`;

const serverApiFetch = async (url: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Cookie", `token=${token.value}`);
  }
  return fetch(url, { ...options, headers, cache: "no-store" });
};

interface ServerData {
  tenants: Tenant[];
  user: User | null;
}

export const serverApiService = {
  getDataOnServer: async (): Promise<ServerData> => {
    try {
      const res = await serverApiFetch(`${API_BASE_URL}/tenants/me/data`);
      if (!res.ok) {
        console.error(`API Error: ${res.status} ${res.statusText}`);
        return { tenants: [], user: null };
      }
      return res.json();
    } catch (error) {
      console.error("Server data fetching error:", error);
      return { tenants: [], user: null };
    }
  },
};
