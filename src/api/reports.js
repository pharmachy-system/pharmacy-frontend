import API from './axios';

export const reportsApi = {
  sales:       (params = {}) => API.get('/reports/sales', { params }).then(r => r.data),
  inventory:   (params = {}) => API.get('/reports/inventory', { params }).then(r => r.data),
  lowStock:    (params = {}) => API.get('/reports/low-stock', { params }).then(r => r.data),
  revenue:     (params = {}) => API.get('/reports/revenue', { params }).then(r => r.data),
  topMedicines:(params = {}) => API.get('/reports/top-medicines', { params }).then(r => r.data),
};
