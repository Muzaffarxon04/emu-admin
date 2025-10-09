import { LoginResponse } from 'types/user.types';
import request from './request';

const authService = {
  login: (data: LoginResponse) => request.post('admin/login', data ),
};

export default authService;
