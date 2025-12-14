import fetchWrapper from '../utils/fetchWrapper';

export const actService = {
  list: () => fetchWrapper.get('/api/acts'),
  get: (id) => fetchWrapper.get(`/api/acts/${id}`),
  create: (data) => fetchWrapper.post('/api/acts', data),
};
