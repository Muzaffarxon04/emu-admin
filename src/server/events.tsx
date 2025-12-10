import request from "./request";
import axios from "axios";
import { EventsResponse } from "types/events.types";
import { ExpoParamsResponse, ParamsResponse } from "types/global.types";

const eventService = {
  getAll: (params?: ParamsResponse) => request.get("events/admin", { params }),
  getID: (id?: number) => request.get(`events/${id}`),
  delete: (id?: number) => request.delete(`events/${id}`),
  export: (params?: ExpoParamsResponse) => request.get(`applications/events`, { params }),
  create: (data?: any) => request.post("events", data),
  update: (id?: number, data?: EventsResponse) => request.patch(`events/${id}`, data),
  getScanStatistics: (eventId?: number) => request.get(`applications/events/${eventId}/scan-statistics`),
  getScanStatisticsExcel: async (eventId?: number) => {
    const access_token = localStorage.getItem('emu_token');
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/applications/events/${eventId}/scan-statistics/excel`,
      {
        responseType: 'blob',
        headers: {
          Authorization: access_token ? `Bearer ${access_token}` : '',
        },
      }
    );
    return response.data;
  },
};

export default eventService;
