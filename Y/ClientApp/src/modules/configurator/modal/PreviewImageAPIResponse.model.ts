import { PreviewProduct } from './PreviewProduct.model';

export class PreviewImageAPIResponse {
  public imageURL: string;
  public errorMsg: string;
  public success: boolean;
  public defaultBase: PreviewProduct;

  /**
   *
   */
  constructor() {}
}
