export interface NewsResponse {
  name_ru: string;
  name_uz: string;
  name_en: string;
  description_uz: string;
  description_en: string;
  description_ru: string;
  id: number;
  created_at: string;
  price: number;
  images:[],
  categories: {
    name_ru: string;
    id: number;
  };
}
