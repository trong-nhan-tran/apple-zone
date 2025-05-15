import { ProductItemWithDetailType } from "./product-item-schema";

export type CartItem = {
  product_item_id: number;
  quantity: number;
  color_name: string;
  thumbnail: string;
  price: number;
  slug: string;
  option_name: string;
  option_value: string;
  product_name: string;
};
