export class CategoriesListModel {
  categories: CategoryModel[];

  constructor(private input) {
    if (input && input.categories && input.categories instanceof Array) {
      this.categories = [];
      input.categories.forEach(item => {
        this.categories.push(new CategoryModel(item));
      });
    }
  }
}

export class CategoryModel {
  id: string;
  name: string;
  imagePosition: string;
  selected: boolean;
  localized_names: LocalizedName[];
  description: string;
  category_template_id: number;
  meta_keywords: string;
  meta_description: string;
  meta_title: string;
  parent_category_id: number;
  page_size: number;
  position: number;
  page_size_options: string;
  price_ranges: string;
  show_on_home_page: boolean;
  include_in_top_menu: boolean;
  has_discounts_applied: boolean;
  published: boolean;
  deleted: boolean;
  display_order: number;
  created_on_utc: string;
  updated_on_utc: string;
  role_ids: any[];
  discount_ids: number[];
  store_ids: any[];
  image: ImageModel;
  se_name: string;
  price_ranges_model: CategoryPriceRanges;
  collections: CategoryModel[];

  constructor(private input) {
    if (input) Object.assign(this, input);
  }
}

export class ImageModel {
  src: string;
  attachment: string;

  constructor(private input) {
    this.src = input ? input.src : null;
    this.attachment = input ? input.attachment : null;
  }
}

export interface LocalizedName {
  language_id: number;
  localized_name: string;
}

export class CategoryPriceRanges {
  public range: { value: string; selected: boolean }[] = [];
  public rangeStr = "";
  public selectedPriceRange = "0-max";

  constructor() {}
}
