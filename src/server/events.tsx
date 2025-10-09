import request from "./request";
import { EventsResponse } from "types/events.types";
import { ExpoParamsResponse, ParamsResponse } from "types/global.types";

const eventService = {
  getAll: (params?: ParamsResponse) => request.get("events/admin", { params }),
  getID: (id?: number) => request.get(`events/${id}`),
  delete: (id?: number) => request.delete(`events/${id}`),
  export: (params?: ExpoParamsResponse) => request.get(`applications/events`, { params }),
  create: (data?: any) => request.post("events", data),
  update: (id?: number, data?: EventsResponse) => request.patch(`events/${id}`, data),
};

export default eventService;
