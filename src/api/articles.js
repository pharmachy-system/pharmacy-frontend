import API from './axios';

export const articlesApi = {
  getAll:    (params = {}) => API.get('/articles', { params }).then(r => r.data),
  getBySlug: (slug) => API.get(`/articles/slug/${slug}`).then(r => r.data),
  getById:   (id) => API.get(`/articles/${id}`).then(r => r.data),
  create:    (data) => API.post('/articles', data).then(r => r.data),
  update:    (id, data) => API.put(`/articles/${id}`, data).then(r => r.data),
  delete:    (id) => API.delete(`/articles/${id}`).then(r => r.data),
};
