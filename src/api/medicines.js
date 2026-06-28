import API from './axios';

export const medicinesApi = {
  getAll:           (params = {}) => API.get('/medicines', { params }).then(r => r.data),
  getById:          (id) => API.get(`/medicines/${id}`).then(r => r.data),
  getBySlug:        (slug) => API.get(`/medicines/slug/${slug}`).then(r => r.data),
  search:           (params = {}) => API.get('/medicines/search/smart', { params }).then(r => r.data),
  suggest:          (q) => API.get('/medicines/search/suggest', { params: { q } }).then(r => r.data),
  getRecommendations: (id) => API.get(`/medicines/${id}/recommendations`).then(r => r.data),
  getAlternatives:  (id) => API.get(`/medicines/${id}/alternatives`).then(r => r.data),
  checkInteractions:(ids) => API.post('/medicines/check-interactions', { medicineIds: ids }).then(r => r.data),
  getLowStock:      (params = {}) => API.get('/medicines/alerts/low-stock', { params }).then(r => r.data),
  getExpiring:      (params = {}) => API.get('/medicines/alerts/expiring', { params }).then(r => r.data),
  create:           (data) => API.post('/medicines', data).then(r => r.data),
  update:           (id, data) => API.put(`/medicines/${id}`, data).then(r => r.data),
  delete:           (id) => API.delete(`/medicines/${id}`).then(r => r.data),
  updateStock:      (id, quantity, operation = 'set') => API.patch(`/medicines/${id}/stock`, { quantity, operation }).then(r => r.data),
  updateAlternatives: (id, add = [], remove = []) => API.patch(`/medicines/${id}/alternatives`, { add, remove }).then(r => r.data),
};
