import { ParamsResponse } from 'types/global.types';
import request from './request';

const cityService = {
  getAll: (params?: ParamsResponse) => request.get('cities', { params }),
  getID: (id?: number) => request.get(`cities/${id}`),
  delete: (id?: number) => request.delete(`cities/${id}`,),
  create: (data?: any) => request.post('cities', data),
  update: (id?: number, data?: any) => request.patch(`cities/${id}`, data),
};

export default cityService;
