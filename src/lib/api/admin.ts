import { apiFetch } from './client';
import { endpoints } from './endpoints';
import type { PaintingDTO } from '../dto';

export type PaintingInput = {
  title: string;
  description: string;
  price: number;
  medium: string;
  size: string;
  year: number;
  availability: 'in-stock' | 'sold';
  image: string;
  tags: string[];
};

export const adminPaintingsList = (params?: { page?: number; limit?: number }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const suffix = query.size ? `?${query.toString()}` : '';
  return apiFetch<{ items: PaintingDTO[]; total: number }>(`${endpoints.admin.paintings.root}${suffix}`, {
    cache: 'no-store',
  });
};

export const adminCreatePainting = (payload: FormData | PaintingInput) =>
  apiFetch<PaintingDTO>(endpoints.admin.paintings.root, {
    method: 'POST',
    body: payload,
    cache: 'no-store',
  });

export const adminUpdatePainting = (id: string, payload: Partial<PaintingInput> | FormData) =>
  apiFetch<PaintingDTO>(endpoints.admin.paintings.detail(id), {
    method: 'PUT',
    body: payload,
    cache: 'no-store',
  });

export const adminDeletePainting = (id: string) =>
  apiFetch<{ status: 'ok' }>(endpoints.admin.paintings.detail(id), {
    method: 'DELETE',
    cache: 'no-store',
  });

export const adminToggleAvailability = (id: string, availability: 'in-stock' | 'sold') =>
  apiFetch<PaintingDTO>(endpoints.admin.paintings.availability(id), {
    method: 'PATCH',
    body: { availability },
    cache: 'no-store',
  });

export const adminDeleteImage = (publicId: string) =>
  apiFetch<{ message: string; success: boolean }>(
    `${endpoints.admin.cloudinary}?publicId=${encodeURIComponent(publicId)}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  );

export const adminUpdateImage = (imageFile: File, existingPublicId?: string) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (existingPublicId) {
    formData.append('existingPublicId', existingPublicId);
  }

  return apiFetch<{
    message: string;
    success: boolean;
    image: string;
    publicId: string;
  }>(endpoints.admin.cloudinary, {
    method: 'POST',
    body: formData,
    cache: 'no-store',
  });
};

export const adminCreateCategory = (categoryName: string) =>
  apiFetch(endpoints.admin.category.root, {
    method: 'POST',
    body: { categoryName },
    cache: 'no-store',
  });

export const adminUpdateCategory = (id: string, categoryName: string) =>
  apiFetch<{ id: string; categoryName: string; createdAt: string; updatedAt: string }>(
    endpoints.admin.category.detail(id),
    {
      method: 'PUT',
      body: { categoryName },
      cache: 'no-store',
    }
  );

export const adminDeleteCategory = (id: string) =>
  apiFetch<{ message: string }>(endpoints.admin.category.detail(id), {
    method: 'DELETE',
    cache: 'no-store',
  });

export const adminGetCategories = () =>
  apiFetch<{ id: string; categoryName: string; createdAt: string; updatedAt: string }[]>(
    endpoints.admin.category.root,
    {
      cache: 'no-store',
    }
  );

export const GetGallery = (params?: { page?: number; limit?: number }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const suffix = query.size ? `?${query.toString()}` : '';

  return apiFetch<{
    galleries: {
      _id: string;
      name: string;
      imageIds: { _id: string; url: string; name: string }[];
      createdAt: string;
      updatedAt: string;
    }[];
    pagination?: { page: number; limit: number; total: number; pages: number };
  }>(`${endpoints.gallery.list}${suffix}`, {
    cache: 'no-store',
  });
};

export const GetGalleryById = (id: string) =>
  apiFetch<{
    gallery: {
      _id: string;
      name: string;
      imageIds: { _id: string; url: string; name: string }[];
      createdAt: string;
      updatedAt: string;
    };
  }>(endpoints.gallery.detail(id), {
    cache: 'no-store',
  });

export const PostGallery = (data: FormData) =>
  apiFetch<{
    gallery: { _id: string; name: string; imageIds: { _id: string; url: string; name: string }[]; createdAt: string };
  }>(endpoints.gallery.add, {
    method: 'POST',
    body: data,
    cache: 'no-store',
  });

export const UpdateGallery = (id: string, data: FormData) =>
  apiFetch<{
    gallery: { _id: string; name: string; imageIds: { _id: string; url: string; name: string }[]; updatedAt: string };
  }>(endpoints.gallery.update(id), {
    method: 'PUT',
    body: data,
    cache: 'no-store',
  });

export const DeleteGallery = (id: string) =>
  apiFetch<{ message: string }>(endpoints.gallery.delete(id), {
    method: 'DELETE',
    cache: 'no-store',
  });

export const deleteImage = (id: string) =>
  apiFetch<{ message: string }>(endpoints.gallery.images.delete(id), {
    method: 'DELETE',
    cache: 'no-store',
  });

export const deleteGalleryImage = (imageId: string) =>
  apiFetch<{ message: string }>(`/api/admin/gallery/images/${imageId}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
