import http from './http';

export const authApi = {
  login: (credentials) => http.post('/auth/login', credentials).then((r) => r.data),
  me: () => http.get('/auth/me').then((r) => r.data.data),
  logout: () => http.post('/auth/logout'),
};
