import { ParamsResponse } from "types/global.types";
import request from "./request";

const mediaService = {
  getAll: (params?: ParamsResponse) => request.get("media", { params }),

  delete: (id?: number) => request.delete(`media/${id}`),
};

export default mediaService;
