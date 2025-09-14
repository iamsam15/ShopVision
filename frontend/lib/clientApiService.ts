export interface Product {
  id: string;
  title: string;
  vendor: string | null;
  createdAt: Date;
  lineItems: {
    quantity: number;
  }[];
}
export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  totalSpend?: number;
  createdAt: string;
}
export interface Order {
  id: string;
  totalPrice: number;
  financialStatus: string | null;
  createdAt: string;
  customer?: { id: string };
}
export interface Checkout {
  id: string;
  email: string | null;
  isCompleted: boolean;
  createdAt: Date;
}
export interface Tenant {
  id: string;
  storeUrl: string;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  checkouts: Checkout[];
}

const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = `${API_HOST}/api`;

const clientApiFetch = (url: string, options: RequestInit = {}) => {
  console.log(API_BASE_URL);
  return fetch(url, {
    ...options,
    credentials: "include",
    cache: "no-store",
  });
};

export const clientApiService = {
  login: (email: string, password: string) =>
    clientApiFetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    }),
  register: (email: string, password: string) =>
    clientApiFetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    }),
  logout: () =>
    clientApiFetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    clientApiFetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: "include",
    }),
  linkTenant: (tenantId: string) =>
    clientApiFetch(`${API_BASE_URL}/tenants/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
      credentials: "include",
    }),
  syncTenant: (tenantId: string) =>
    clientApiFetch(`${API_BASE_URL}/tenants/${tenantId}/sync`, {
      method: "POST",
      credentials: "include",
    }),
  getData: () => clientApiFetch(`${API_BASE_URL}/tenants/me/data`),
  deleteTenant: (tenantId: string) =>
    clientApiFetch(`${API_BASE_URL}/tenants/${tenantId}`, {
      method: "DELETE",
      credentials: "include",
    }),
  getCheckoutStats: (tenantId: string) =>
    clientApiFetch(`${API_BASE_URL}/tenants/${tenantId}/checkout-stats`),
};
