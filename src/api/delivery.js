import API from './axios';

export const deliveryApi = {
  getZones:         (params = {}) => API.get('/delivery/zones', { params }).then(r => r.data),
  getZoneById:      (id) => API.get(`/delivery/zones/${id}`).then(r => r.data),
  lookupZone:       (city) => API.get('/delivery/zones/lookup', { params: { city } }).then(r => r.data),
  calculateFee:     (data) => API.post('/delivery/calculate-fee', data).then(r => r.data),
  createZone:       (data) => API.post('/delivery/zones', data).then(r => r.data),
  updateZone:       (id, data) => API.put(`/delivery/zones/${id}`, data).then(r => r.data),
  deleteZone:       (id) => API.delete(`/delivery/zones/${id}`).then(r => r.data),
  getMyDeliveries:  (params = {}) => API.get('/delivery/my-deliveries', { params }).then(r => r.data),
  markDelivered:    (orderId) => API.patch(`/delivery/orders/${orderId}/delivered`).then(r => r.data),
  updateLocation:   (location) => API.patch('/delivery/driver/location', location).then(r => r.data),
  updateStatus:     (status) => API.patch('/delivery/driver/status', { status }).then(r => r.data),
  assignDriver:     (data) => API.post('/delivery/assign-driver', data).then(r => r.data),
  getDrivers:       () => API.get('/delivery/drivers').then(r => r.data),
};
