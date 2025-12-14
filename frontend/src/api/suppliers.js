import fetchWrapper from '../utils/fetchWrapper';

export const supplierService = {
  list: () => fetchWrapper.get('/api/suppliers'),
  get: (id) => fetchWrapper.get(`/api/suppliers/${id}`),
  create: (data) => fetchWrapper.post('/api/suppliers', data),
  update: (id, data) => fetchWrapper.put(`/api/suppliers/${id}`, data),
  remove: (id) => fetchWrapper.delete(`/api/suppliers/${id}`),
};
