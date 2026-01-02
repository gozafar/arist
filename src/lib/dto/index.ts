import { UserRole } from '@/models/User';

export type PaintingDTO = {
  imageWidth: number;
  imageHeight: number;
  width: number;
  height: number;
  id: string;
  title: string;
  price: number;
  medium: string;
  size: string;
  year: number;
  description: string;
  image: string;
  tags: string[];
  availability: 'in-stock' | 'sold';
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type AddressDTO = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  postal: string;
};

export type CartLineDTO = {
  id: string;
  paintingId: string;
  quantity: number;
  painting: PaintingDTO;
};

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};
