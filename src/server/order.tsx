import { ParamsResponse } from "types/global.types";
import request from "./request";

const orderService = {
  getAll: (params?: ParamsResponse) => request.get("orders", { params }),
  update: (id?: number, data?: any) => request.patch(`orders/${id}`, data),
  getID: (id?: number) => request.get(`orders/${id}`),
};

export default orderService;
