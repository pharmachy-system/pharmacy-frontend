import API from './axios';

export const paymentApi = {
  createIntent:   (data) => API.post('/payments/create-intent', data).then(r => r.data),
  verify:         (orderId) => API.get(`/payments/${orderId}/verify`).then(r => r.data),
  getHistory:     (params = {}) => API.get('/payments/history', { params }).then(r => r.data),
  requestRefund:  (data) => API.post('/payments/refund', data).then(r => r.data),
  adminGetAll:    (params = {}) => API.get('/payments/admin/all', { params }).then(r => r.data),
  adminUpdateStatus: (id, status) => API.patch(`/payments/admin/${id}/status`, { status }).then(r => r.data),
};
