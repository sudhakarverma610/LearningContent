 
export class UserCreation {
  public Id:number;
  public image_url: string;
  public SelectedChainSku: string; 
  public AllProductsSkus: string;
   constructor() {}
}
export class UserCreationResponseDto{
    public Status :boolean;
    public data:UserCreation[];
}
export class UserCreationSaveResponseDto{
    public Status :boolean;
    public Error:string;
}