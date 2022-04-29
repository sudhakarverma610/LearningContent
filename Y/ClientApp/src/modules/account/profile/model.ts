import { OrderItem } from 'src/store/order.model';

export interface OrderReturnRequest {
    orderId: string;
    customOrderNumber: string;
    ReturnRequestAction: ReturnRequestAction[];
    ReturnRequestReason: ReturnRequestReason[];
    orderItems: RequestReturnItem[];
    step: number;
    status: string;
  }
export interface ReturnRequestAction {
      Id: number;
      Name: string;
  }
export interface ReturnRequestReason {
      Id: number;
      Name: string;
  }

export interface RequestReturnItem {
    orderItem: OrderItem;
    isReturnAble: boolean;
    selectedAction: ReturnRequestAction;
    selectedReason: ReturnRequestReason;
    comment: string;
    fileToUpload: any;
    fileUploadId: number;
    isFileUploading: boolean;
    intialUploadText: string;
    intialUploadUrl: string;
    UploadText: string;
    message: string;
    // sucesstext: {status: boolean, class: string, message: string};
    error: string;
    IsSelected: boolean;
    IsBrecelet: boolean;
    newSize: string;
    quantityIndex: number;
    showfold: number;
  }

export interface SubmitReturnRequestDto {
    orderId: string;
    orderItems: ItemSubmitRequestDto[];

  }
export interface ItemSubmitRequestDto {

      itemId: string;
      productId: number;
      quantity: number;
      reasonForReturnId: number;
      requestedActionId: number;
      comments: string;
      uploadFileId: number;
      newSize: string;
  }
export interface OrderItemRating {
  orderItemId: string;
  rate: number;
  comment: string;
  orderItem: OrderItem;
  orderId: number;
}

