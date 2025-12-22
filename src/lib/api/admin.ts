import { apiFetch } from "./client";
import { endpoints } from "./endpoints";
import type { PaintingDTO } from "../dto";

export type PaintingInput = {
  title: string;
  description: string;
  price: number;
  medium: string;
  size: string;
  year: number;
  availability: "in-stock" | "sold";
  image: string;
  tags: string[];
};

export const adminPaintingsList = (params?: { page?: number; limit?: number }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const suffix = query.size ? `?${query.toString()}` : "";
  return apiFetch<{ items: PaintingDTO[]; total: number }>(`${endpoints.admin.paintings.root}${suffix}`, {
    cache: "no-store"
  });
};

export const adminCreatePainting = (payload: PaintingInput) =>
  apiFetch<PaintingDTO>(endpoints.admin.paintings.root, {
    method: "POST",
    body: payload,
    cache: "no-store"
  });

export const adminUpdatePainting = (id: string, payload: Partial<PaintingInput>) =>
  apiFetch<PaintingDTO>(endpoints.admin.paintings.detail(id), {
    method: "PATCH",
    body: payload,
    cache: "no-store"
  });

export const adminDeletePainting = (id: string) =>
  apiFetch<{ status: "ok" }>(endpoints.admin.paintings.detail(id), {
    method: "DELETE",
    cache: "no-store"
  });

export const adminToggleAvailability = (id: string, availability: "in-stock" | "sold") =>
  apiFetch<PaintingDTO>(endpoints.admin.paintings.availability(id), {
    method: "PATCH",
    body: { availability },
    cache: "no-store"
  });
