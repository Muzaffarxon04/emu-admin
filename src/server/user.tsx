import request from "./request";

const userService = {
  getAll: (params?: any) => request.get("user/all", { params }),
  getID: (id?: number) => request.get(`user/${id}`),
  delete: (id?: number) => request.delete(`user/${id}`),
  create: (data?: any) => request.post("master/register", data),
  update: (id?: number, data?: any) => request.patch(`user/${id}`, data),
};

export default userService;
