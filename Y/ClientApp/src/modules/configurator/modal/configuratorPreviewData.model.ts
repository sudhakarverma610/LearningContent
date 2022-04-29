import { Product } from 'src/store/products/products.model';

export class ConfiguratorPreviewData {
  public imageSrc: string;
  public preSelectedCharms: Product[];
  public preSelectedChains: Product[];
  public selectedId: string;

  /**
   *
   */
  constructor() {}
}
