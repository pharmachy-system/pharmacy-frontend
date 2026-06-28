import API from './axios';

export const notificationsApi = {
  getAll:       (params = {}) => API.get('/notifications', { params }).then(r => r.data),
  getCount:     () => API.get('/notifications/count').then(r => r.data),
  markRead:     (id) => API.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllRead:  () => API.patch('/notifications/read-all').then(r => r.data),
  deleteOne:    (id) => API.delete(`/notifications/${id}`).then(r => r.data),
  clearAll:     () => API.delete('/notifications').then(r => r.data),
  send:         (data) => API.post('/notifications/send', data).then(r => r.data),
};
