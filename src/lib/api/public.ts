import { apiFetch } from "./client";
import { endpoints } from "./endpoints";
import { AddressDTO, CartLineDTO, Paginated, PaintingDTO } from "../dto";

export const getPaintings = (params?: { page?: number; limit?: number; availability?: string }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.availability) query.set("availability", params.availability);
  const suffix = query.size ? `?${query.toString()}` : "";
  return apiFetch<Paginated<PaintingDTO>>(`${endpoints.paintings.list}${suffix}`, {
    next: { tags: ["paintings"] }
  });
};

export const getPaintingById = (id: string) =>
  apiFetch<PaintingDTO>(endpoints.paintings.detail(id), {
    next: { tags: ["paintings"] }
  });

export const sendContactMessage = (payload: { name: string; email: string; phone?: string; message: string }) =>
  apiFetch<{ status: "ok" }>(endpoints.contact, {
    method: "POST",
    body: payload,
    cache: "no-store"
  });

export const fetchCart = () =>
  apiFetch<{ items: CartLineDTO[]; subtotal: number }>(endpoints.cart.root, {
    method: "GET",
    cache: "no-store"
  });

export const addCartItem = (payload: { paintingId: string; quantity?: number }) =>
  apiFetch<{ items: CartLineDTO[]; subtotal: number }>(endpoints.cart.root, {
    method: "POST",
    body: payload,
    cache: "no-store"
  });

export const updateCartItem = (id: string, quantity: number) =>
  apiFetch<{ items: CartLineDTO[]; subtotal: number }>(endpoints.cart.items(id), {
    method: "PATCH",
    body: { quantity },
    cache: "no-store"
  });

export const removeCartItem = (id: string) =>
  apiFetch<{ items: CartLineDTO[]; subtotal: number }>(endpoints.cart.items(id), {
    method: "DELETE",
    cache: "no-store"
  });

export const clearCart = () =>
  apiFetch<{ items: CartLineDTO[]; subtotal: number }>(endpoints.cart.root, {
    method: "DELETE",
    cache: "no-store"
  });

export const checkout = (payload: { shipping: AddressDTO }) =>
  apiFetch<{ orderId: string; amount: number }>(endpoints.checkout, {
    method: "POST",
    body: payload,
    cache: "no-store"
  });

export const confirmPayment = (payload: { orderId: string }) =>
  apiFetch<{ status: "succeeded" | "failed"; receiptUrl?: string }>(endpoints.payment.confirm, {
    method: "POST",
    body: payload,
    cache: "no-store"
  });
