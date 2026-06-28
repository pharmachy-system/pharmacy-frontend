import API from './axios';

export const brandsApi = {
  getAll:  (params = {}) => API.get('/brands', { params }).then(r => r.data),
  getById: (id) => API.get(`/brands/${id}`).then(r => r.data),
  create:  (data) => API.post('/brands', data).then(r => r.data),
  update:  (id, data) => API.put(`/brands/${id}`, data).then(r => r.data),
  delete:  (id) => API.delete(`/brands/${id}`).then(r => r.data),
};
