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
  calculatePoints: (data?: { user_id: number; event_id: number; points: number; reason: string; operation: "add" | "subtract" }) => 
    request.post("admin/calculate-points", data),
  addManualPoints: (data?: { user_id: number; points: number; event_id?: number|null; description: string }) => 
    request.post("applications/events/manual-points", data),
  getEventParticipants: (eventId?: number) => request.get(`applications/events`, { params: { event_id: eventId } }),
  getPointsHistory: (userId?: number) => request.get(`applications/events/manual-points/history`, { params: { user_id: userId } }),
  getAllPointsHistory: (params?: any) => request.get(`applications/events/manual-points/history`, { params }),
};

export default eventService;
