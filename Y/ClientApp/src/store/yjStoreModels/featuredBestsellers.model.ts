import { Product } from '../products/products.model';

export interface FeaturedBestSellers {
  productData: FeaturedProductData[];
}

export interface FeaturedProductData {
  category_sename: string;
  category_name: string;
  products: Product[];
}
