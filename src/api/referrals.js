import API from './axios';

export const referralsApi = {
  getMy:          () => API.get('/referrals/me').then(r => r.data),
  getReferredUsers: (params = {}) => API.get('/referrals/me/referred-users', { params }).then(r => r.data),
  validate:       (code) => API.get(`/referrals/validate/${code}`).then(r => r.data),
  adminStats:     () => API.get('/referrals/admin/stats').then(r => r.data),
};
