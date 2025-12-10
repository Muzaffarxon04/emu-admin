export interface EventsResponse {
  name_ru: string;
  name_uz: string;
  name_en: string;
  description_uz: string;
  description_en: string;
  description_ru: string;
  address_uz: string;
  address_en: string;
  address_ru: string;
  city_id: number;
  id: number;
  address: string;
  place: number;
  price: number;
  scores: number;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  count_applications: number,
  phone: string,
  image_urls: [],
  qr_code?: string,
  latitude?: number,
  longitude?: number,
  cities: {
    name_ru: string,
    id: number
  }
}

