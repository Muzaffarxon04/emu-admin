import request from './request';

const uploadService = {
  fileUpload: (data: any) => request.post('upload/media', data ),
};

export default uploadService;
