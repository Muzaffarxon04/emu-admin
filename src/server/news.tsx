import { NewsResponse } from 'types/news.types';
import request from './request';
import { ParamsResponse } from 'types/global.types';

const newsService = {
  getAll: (params?: ParamsResponse) => request.get('news', { params }),
  getID: (id?: number) => request.get(`news/${id}`),
  delete: (id: number) => request.delete(`news/${id}`),
  create: (data?: any) => request.post('news', data),
  update: (id?: number, data?: NewsResponse) => request.patch(`news/${id}`, data),
};

export default newsService;
