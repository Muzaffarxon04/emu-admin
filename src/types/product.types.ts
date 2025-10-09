interface category {
  name_ru: string;
  name_uz: string;
  name_en: string;
}

export interface ProductResponse {
  name_ru: string;
  name_uz: string;
  name_en: string;
  description_uz: string;
  description_en: string;
  description_ru: string;
  price: number;
  id: number;
  categories: category;
  category_name:string
}
