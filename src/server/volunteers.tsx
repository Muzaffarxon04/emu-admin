import { ParamsResponse } from 'types/global.types';
import request from './request';

const volunteerService = {
  getAll: (params?: ParamsResponse) => request.get('volunteers', { params }),
  getID: (id?: number) => request.get(`volunteers/${id}`),
  delete: (id?: number) => request.delete(`volunteers/${id}`,),
  create: (data?: any) => request.post('volunteers', data),
  update: (id?: number, data?: any) => request.patch(`volunteers/${id}`, data),
};

export default volunteerService;
