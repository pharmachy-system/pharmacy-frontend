import API from './axios';

export const flashsalesApi = {
  getActive:       () => API.get('/flash-sales/active').then(r => r.data),
  getAll:          (params = {}) => API.get('/flash-sales', { params }).then(r => r.data),
  getById:         (id) => API.get(`/flash-sales/${id}`).then(r => r.data),
  create:          (data) => API.post('/flash-sales', data).then(r => r.data),
  update:          (id, data) => API.put(`/flash-sales/${id}`, data).then(r => r.data),
  toggle:          (id) => API.patch(`/flash-sales/${id}/toggle`).then(r => r.data),
  delete:          (id) => API.delete(`/flash-sales/${id}`).then(r => r.data),
  addMedicines:    (id, medicineIds) => API.post(`/flash-sales/${id}/medicines`, { medicineIds }).then(r => r.data),
  removeMedicines: (id, medicineIds) => API.delete(`/flash-sales/${id}/medicines`, { data: { medicineIds } }).then(r => r.data),
};
