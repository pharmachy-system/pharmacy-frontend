import API from './axios';

export const walletApi = {
  get:          () => API.get('/wallet').then(r => r.data),
  transactions: (params = {}) => API.get('/wallet/transactions', { params }).then(r => r.data),
  credit:       (data) => API.post('/wallet/credit', data).then(r => r.data),
  debit:        (data) => API.post('/wallet/debit', data).then(r => r.data),
};
