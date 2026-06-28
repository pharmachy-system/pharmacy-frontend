import API from './axios';

export const couponsApi = {
  validate: (code) => API.post('/coupons/validate', { code }).then(r => r.data),
  getAll:   (params = {}) => API.get('/coupons', { params }).then(r => r.data),
  getById:  (id) => API.get(`/coupons/${id}`).then(r => r.data),
  create:   (data) => API.post('/coupons', data).then(r => r.data),
  update:   (id, data) => API.put(`/coupons/${id}`, data).then(r => r.data),
  delete:   (id) => API.delete(`/coupons/${id}`).then(r => r.data),
};
