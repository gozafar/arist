export const endpoints = {
  paintings: {
    list: "/api/paintings",
    detail: (id: string) => `/api/paintings/${id}`
  },
  contact: "/api/contact",
  cart: {
    root: "/api/cart",
    items: (id: string) => `/api/cart/items/${id}`
  },
  checkout: "/api/checkout",
  payment: {
    confirm: "/api/payment/confirm"
  },
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    me: "/api/auth/me",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout"
  },
  admin: {
    paintings: {
      root: "/api/admin/paintings",
      detail: (id: string) => `/api/admin/paintings/${id}`,
      availability: (id: string) => `/api/admin/paintings/${id}/availability`
    },
    uploadSign: "/api/admin/uploads/sign"
  }
};
