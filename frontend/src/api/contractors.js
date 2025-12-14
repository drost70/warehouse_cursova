import fetchWrapper from '../utils/fetchWrapper';

export const contractorService = {
  list: () => fetchWrapper.get('/api/contractors'),
  get: (id) => fetchWrapper.get(`/api/contractors/${id}`),
  create: (data) => fetchWrapper.post('/api/contractors', data),
  update: (id, data) => fetchWrapper.put(`/api/contractors/${id}`, data),
  remove: (id) => fetchWrapper.delete(`/api/contractors/${id}`),
};
