import API from './axios';

export const returnsApi = {
  create:   (data) => API.post('/returns', data).then(r => r.data),
  getMy:    (params = {}) => API.get('/returns/my', { params }).then(r => r.data),
  getById:  (id) => API.get(`/returns/${id}`).then(r => r.data),
  getAll:   (params = {}) => API.get('/returns', { params }).then(r => r.data),
  approve:  (id, data) => API.patch(`/returns/${id}/approve`, data).then(r => r.data),
  reject:   (id, data) => API.patch(`/returns/${id}/reject`, data).then(r => r.data),
  complete: (id) => API.patch(`/returns/${id}/complete`).then(r => r.data),
};
