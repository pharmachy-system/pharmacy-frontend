import API from './axios';

export const categoriesApi = {
  getAll:   (params = {}) => API.get('/categories', { params }).then(r => r.data),
  getTree:  () => API.get('/categories/tree').then(r => r.data),
  getById:  (id) => API.get(`/categories/${id}`).then(r => r.data),
  create:   (data) => API.post('/categories', data).then(r => r.data),
  update:   (id, data) => API.put(`/categories/${id}`, data).then(r => r.data),
  delete:   (id) => API.delete(`/categories/${id}`).then(r => r.data),
};
