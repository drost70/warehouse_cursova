import fetchWrapper from '../utils/fetchWrapper';

export const invoiceService = {
  list: () => fetchWrapper.get('/api/invoices'),
  get: (id) => fetchWrapper.get(`/api/invoices/${id}`),
  create: (data) => fetchWrapper.post('/api/invoices', data),
  issue: (id) => fetchWrapper.post(`/api/invoices/${id}/issue`),
  getItems: (invoiceId) => fetchWrapper.get(`/api/invoices/${invoiceId}/items`)
};
