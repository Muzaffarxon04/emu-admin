import { ParamsResponse } from 'types/global.types';
import request from './request';

const productService = {
  getAll: (params?: ParamsResponse) => request.get('products', { params }),
  getID: (id?: number) => request.get(`products/${id}`),
  delete: (id?: number) => request.delete(`products/${id}`,),
  create: (data?: any) => request.post('products', data),
  update: (id?: number, data?: any) => request.patch(`products/${id}`, data),
};

export default productService;
