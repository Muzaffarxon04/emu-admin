import { ParamsResponse } from "types/global.types";
import request from "./request";

const storeService = {
  getAll: (params?: ParamsResponse) => request.get("stories", { params }),
  getID: (id?: number) => request.get(`stories/${id}`),
  delete: (id?: number) => request.delete(`stories/${id}`),
  create: (data?: any) => request.post("stories", data),
  update: (id?: number, data?: any) => request.patch(`stories/${id}`, data),
};

export default storeService;
