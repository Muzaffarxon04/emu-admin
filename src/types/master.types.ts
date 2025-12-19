export interface MasterResponse {
  first_name: string;
  last_name: string;
  middle_name: string;
  role: string;
  id: number;
  phone: string,
  cities: {
    name_ru: string;
  };
  email: string;
  balance?: number;
}
