import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export type ContactRequest = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: string;
};

export type ContactResponse = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type GetContactsResponse = {
  contacts: ContactResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    status: string | null;
    search: string | null;
  };
};

export const createContact = (payload: ContactRequest) =>
  apiFetch<ContactResponse>(endpoints.contactUser.post, {
    method: "POST",
    body: payload,
    cache: "no-store"
  });

export const getContacts = (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);

  const suffix = query.size ? `?${query.toString()}` : "";

  return apiFetch<GetContactsResponse>(`${endpoints.contactUser.get}${suffix}`, {
    method: "GET",
    cache: "no-store"
  });
};

export const updateContact = (id: string, payload: Partial<ContactRequest>) =>
  apiFetch<ContactResponse>(endpoints.contactUser.update(id), {
    method: "PUT",
    body: payload,
    cache: "no-store"
  });

export const deleteContact = (id: string) =>
  apiFetch<void>(endpoints.contactUser.delete(id), {
    method: "DELETE",
    cache: "no-store"
  });
