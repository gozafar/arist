export const endpoints = {
  contactUser:{
    post:"/api/contact",
    get:"/api/admin/contact",
    update:(id: string) =>`/api/admin/contact/${id}`,
    delete:(id:string) =>`/api/admin/contact/${id}`
  },
  gallery:{
    list:"/api/gallery",
    detail: (id: string) => `/api/admin/gallery/${id}`,
    add:"/api/admin/gallery",
    update: (id: string) => `/api/admin/gallery/${id}`,
    delete: (id: string) => `/api/admin/gallery/${id}`
  },
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
  paintingOrder: "/api/painting-order",
  admin: {
      paintingOrder: {
        root: "/api/admin/painting-order",
        detail: (id: string) => `/api/admin/painting-order/${id}`
      },
    paintings: {
      root: "/api/admin/paintings",
      detail: (id: string) => `/api/admin/paintings/${id}`,
      availability: (id: string) => `/api/admin/paintings/${id}/availability`
    },
    uploadSign: "/api/admin/uploads/sign",
    category: "/api/admin/category"
  }
};
