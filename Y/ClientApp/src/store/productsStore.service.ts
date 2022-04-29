import { Injectable } from '@angular/core';
import { ProductList, ProductDTO, Product } from './products/products.model';
import { FeaturedBestSellers } from './yjStoreModels/featuredBestsellers.model';

@Injectable()
export class ProductStoreService {
  public bestSellers: FeaturedBestSellers;
  public sets: ProductList = new ProductList([]);
  public categoryProducts: CategoryProducts[] = [];
  public bestSellersLoaded = false;
  public setsLoaded = false;
  public products: Product[] = [];
  public productsListing: Product[] = [];
  constructor() {}

  setBestSellers(input: FeaturedBestSellers) {
    this.bestSellers = input;
    this.bestSellersLoaded = true;
  }
  getBestSellers(): FeaturedBestSellers {
    return this.bestSellers;
  }
  getBestSellersStatus() {
    return this.bestSellersLoaded;
  }

  setSets(input) {
    this.sets = new ProductList(input);
    this.setsLoaded = true;
  }

  getSets() {
    return this.sets;
  }

  getSetsStatus() {
    return this.setsLoaded;
  }

  setCategoryProducts(slug, list: ProductDTO, pageNumber) {
    if (slug.substring(0, 6) == 'new-in') {
      return;
    }
    if (pageNumber > 1) {
      const tempIndex = this.categoryProducts.findIndex(
        item => item.se_name === slug
      );
      if (tempIndex !== -1) {
        this.categoryProducts[tempIndex].productList.products.push(
          ...list.products
        );
        this.categoryProducts[tempIndex].page = pageNumber;
        this.addCategoryProducts(list.products);
      }
    } else {
      // tslint:disable-next-line: no-use-before-declare
      this.categoryProducts.push(new CategoryProducts(slug, list, pageNumber));
      this.addCategoryProducts(list.products);
    }
  }

  getProductsByCategorySlug(slug) {
    const tempItem = this.categoryProducts.find(item => item.se_name === slug);
    if (tempItem) {
      return tempItem.productList;
    } else {
      return null;
    }
  }

  getCategoryPageBySlug(slug) {
    const tempItem = this.categoryProducts.find(item => item.se_name === slug);
    if (tempItem) {
      return tempItem.page;
    } else {
      return 1;
    }
  }

  addCategoryProducts(list) {
    list.forEach(element => {
      if (!this.products.find(item => item.se_name === element.se_name)) {
        this.products.push(element);
      }
    });
  }
  addSingleProduct(product) {
    this.productsListing.push(product);
  }

  getProduct(productSlug) {
    return this.productsListing.find(item => item.se_name === productSlug);
  }

  getProductById(productId) {
    return this.productsListing.find(item => item.id === productId.toString());
  }

  getProductBySku(sku: string) {
    return this.productsListing.find(item => item.sku === sku);
  }
}

export class CategoryProducts {
  se_name: string;
  productList: ProductDTO;
  page: number;

  constructor(se_name: string, list: ProductDTO, pageNumber: number) {
    this.se_name = se_name;
    this.productList = list;
    this.page = pageNumber;
  }
}
