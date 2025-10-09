export interface DefaultResponse {
  status: string;
  detail: string;
  pagination: object;
  data: object;
}

export interface ParamsResponse {
  page?: number;
  offset?: number;
  limit: number;
  role?: string;
  is_active?:boolean
}
export interface ExpoParamsResponse {
  status?: string;
  event_id: void;
}
export interface LangType {
  shortcode: string;
  locale: string;
}
