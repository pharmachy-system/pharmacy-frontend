import API from './axios';

export const userApi = {
  getProfile:    () => API.get('/users/me').then(r => r.data),
  updateProfile: (data) => API.put('/users/me', data).then(r => r.data),
  uploadAvatar:  (formData) => API.post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  changePassword:(data) => API.put('/users/me/change-password', data).then(r => r.data),
  getLoyalty:    () => API.get('/users/me/loyalty').then(r => r.data),
  getRecentlyViewed: () => API.get('/users/me/recently-viewed').then(r => r.data),
  getAddresses:  () => API.get('/users/me/addresses').then(r => r.data),
  addAddress:    (data) => API.post('/users/me/addresses', data).then(r => r.data),
  updateAddress: (id, data) => API.put(`/users/me/addresses/${id}`, data).then(r => r.data),
  deleteAddress: (id) => API.delete(`/users/me/addresses/${id}`).then(r => r.data),
  setDefaultAddress: (id) => API.patch(`/users/me/addresses/${id}/default`).then(r => r.data),
  updateFcmToken:(token) => API.patch('/users/me/fcm-token', { fcmToken: token }).then(r => r.data),
};
