import fetchWrapper from '../utils/fetchWrapper';

export const fetchValuation = (strategy) => 
  fetchWrapper.get(`/api/reports/valuation?strategy=${strategy}`);

export const fetchStockOnDate = (date) => 
  fetchWrapper.get(`/api/reports/stock?date=${date}`);
