import { ParamsResponse } from 'types/global.types';
import request from './request';
import { FaqResponse } from 'types/faq.types';

const faqService = {
  getAll: (params?: ParamsResponse) => request.get('faqs', { params }),
  getID: (id?: number) => request.get(`faqs/${id}`),
  delete: (id: number) => request.delete(`faqs/${id}`, ),
  create: (data?: any) => request.post('faqs', data),
  update: (id?: number, data?: FaqResponse) => request.patch(`faqs/${id}`, data),
};

export default faqService;
