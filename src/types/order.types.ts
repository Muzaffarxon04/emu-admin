interface product {
  name_en: string;
  name_ru: string;
  name_uz: string;
  price: number;
  id: number
}

interface user {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export interface OrderResponse {
  created_at: string;
  count: number;
  updated_at: string;
  order_status: string;
  id: number;
  product_id: number;
  products: product;
  users: user;
}
