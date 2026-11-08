import http from './http';

export const usersApi = {
  list: (params) => http.get('/users', { params }).then((r) => r.data),
  create: (payload) => http.post('/users', payload).then((r) => r.data.data),
  update: (id, payload) => http.put(`/users/${id}`, payload).then((r) => r.data.data),
  remove: (id) => http.delete(`/users/${id}`),
};
