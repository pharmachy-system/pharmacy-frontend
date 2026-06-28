import API from './axios';

export const reviewsApi = {
  getForMedicine: (medicineId, params = {}) => API.get(`/medicines/${medicineId}/reviews`, { params }).then(r => r.data),
  getAll:         (params = {}) => API.get('/reviews', { params }).then(r => r.data),
  adminGetAll:    (params = {}) => API.get('/reviews/admin/all', { params }).then(r => r.data),
  create:         (medicineId, data) => API.post(`/medicines/${medicineId}/reviews`, data).then(r => r.data),
  update:         (id, data) => API.put(`/reviews/${id}`, data).then(r => r.data),
  delete:         (id) => API.delete(`/reviews/${id}`).then(r => r.data),
  markHelpful:    (id) => API.post(`/reviews/${id}/helpful`).then(r => r.data),
  moderate:       (id, data) => API.patch(`/reviews/${id}/moderate`, data).then(r => r.data),
};
