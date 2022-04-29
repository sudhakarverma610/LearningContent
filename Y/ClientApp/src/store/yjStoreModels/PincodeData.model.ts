export interface PincodeDataModel {
  Message: string;
  Status: string;
  PostOffice: PostOfficeModel[];
}

export interface PostOfficeModel {
  Name: string;
  Description: string;
  BranchType: string;
  DeliveryStatus: string;
  Taluk: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  State: string;
  Country: string;
}
