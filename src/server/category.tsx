import { ParamsResponse } from 'types/global.types';
import request from './request';

const categoryService = {
  getAll: (params?: ParamsResponse) => request.get('categories', { params }),
  getID: (id?: number) => request.get(`categories/${id}`),
  delete: (id?: number) => request.delete(`categories/${id}`,),
  create: (data?: any) => request.post('categories', data),
  update: (id?: number, data?: any) => request.patch(`categories/${id}`, data),
};

export default categoryService;
