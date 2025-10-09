import { ParamsResponse } from 'types/global.types';
import request from './request';

const grandService = {
  getAll: (params?: ParamsResponse) => request.get('grands', { params }),
  export: (params?: any) => request.get('applications/grands', { params }),
  getID: (id?: number) => request.get(`grands/${id}`),
  delete: (id?: number) => request.delete(`grands/${id}`,),
  create: (data?: any) => request.post('grands', data),
  update: (id?: number, data?: any) => request.patch(`grands/${id}`, data),
};

export default grandService;
