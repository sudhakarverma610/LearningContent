import { Injectable } from '@angular/core';
import { CategoriesListModel } from './categories/categories.model';

@Injectable()
export class CategoryStoreService {
  public categoriesList: CategoriesListModel = new CategoriesListModel([]);
  public isCategoriesLoaded = false;

  public categoriesNavList: { homeSubCategories: NavSubCategories };
  public isNavCategoriesLoaded = false;
  constructor() {}

  setCategoriesList(input: CategoriesListModel) {
    this.categoriesList = new CategoriesListModel(input);
    this.isCategoriesLoaded = true;
  }

  getCategoriesList() {
    return this.categoriesList;
  }

  getCategoriesListLoadedStatus() {
    return this.isCategoriesLoaded;
  }

  setNavCategoriesList(input: { homeSubCategories: NavSubCategories }) {
    this.categoriesNavList = input;
    this.isNavCategoriesLoaded = true;
  }

  getNavCategoriesList() {
    return this.categoriesNavList;
  }

  getNavCategoriesListLoadedStatus() {
    return this.isNavCategoriesLoaded;
  }

  getCategoryBySlug(slug) {
    if (
      this.categoriesList &&
      this.categoriesList.categories &&
      this.categoriesList.categories.length > 0
    ) {
      return this.categoriesList.categories.find(item => item.se_name === slug);
    } else {
      return null;
    }
  }

  getCategoryById(id) {
    if (
      this.categoriesList &&
      this.categoriesList.categories &&
      this.categoriesList.categories.length > 0
    ) {
      return this.categoriesList.categories.find(item => item.id === id);
    } else {
      return null;
    }
  }
}

export class NavSubCategories {
  chains: { name: string; se_name: string;image:{alt:string;attachment:string;src:string;title:string} }[];
  charms: { name: string; se_name: string; image:{alt:string;attachment:string;src:string;title:string}}[];
  sets: { name: string; se_name: string;image:{alt:string;attachment:string;src:string;title:string} }[];
}
