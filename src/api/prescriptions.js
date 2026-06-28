import API from './axios';

export const prescriptionsApi = {
  getMy:     (params = {}) => API.get('/prescriptions/my-prescriptions', { params }).then(r => r.data),
  getAll:    (params = {}) => API.get('/prescriptions', { params }).then(r => r.data),
  getById:   (id) => API.get(`/prescriptions/${id}`).then(r => r.data),
  create:    (formData) => API.post('/prescriptions', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  updateStatus: (id, data) => API.put(`/prescriptions/${id}/status`, data).then(r => r.data),
};
