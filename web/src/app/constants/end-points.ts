export type ServiceData = {
  url: string;
  type: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
};

export type ServiceKeys = keyof typeof services;

export const services = {
  getCategories: {
    url: '/category',
    type: 'GET',
  },
  addCategory: {
    url: '/category',
    type: 'POST',
  },
  getCategory: {
    url: '/category/{id}',
    type: 'GET',
  },
  editCategory: {
    url: '/category/{id}',
    type: 'PUT',
  },
  deleteCategory: {
    url: '/category/{id}',
    type: 'DELETE',
  },
  getProducts: {
    url: '/product',
    type: 'GET',
  },
  addProduct: {
    url: '/product',
    type: 'POST',
  },
  getProduct: {
    url: '/product/{id}',
    type: 'GET',
  },
  editProduct: {
    url: '/product/{id}',
    type: 'PUT',
  },
  deleteProducts: {
    url: '/product/{id}',
    type: 'DELETE',
  },
} as const;
