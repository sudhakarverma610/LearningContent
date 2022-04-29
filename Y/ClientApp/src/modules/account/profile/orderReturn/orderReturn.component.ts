import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Attribute } from 'src/store/products/products.model';
import { ItemSubmitRequestDto, OrderReturnRequest, RequestReturnItem, SubmitReturnRequestDto } from '../model';
import { ProfileService } from '../profile.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-orderReturn',
  templateUrl: './orderReturn.component.html',
  styleUrls: ['./orderReturn.component.scss']
})
export class OrderReturnComponent implements OnInit {
public returnrequest: OrderReturnRequest;
public orderitems: RequestReturnItem[] = [];
public isAllSelected = false;
public step = 1;
public isSuccessscreen = false;
public baseUrl: string;
displayedColumnstwo: string[] = ['image', 'product'];
public backUrl = '/account/orders/myorders';
public returnAmountChange = 150;
public AllowImageToUpload = true;
public dataSource: MatTableDataSource<any> = new MatTableDataSource(
  []
);
  error: string;
  iserror = false;
  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject('BASE_API_URL') baseUrl: string
    ) {
      this.baseUrl = baseUrl;
     }

  ngOnInit() {
    this.returnrequest = this.route.snapshot.data.returnRequest as OrderReturnRequest;
    this.step = this.returnrequest.step;
    this.backUrl = '/account/orders/orderDetails/' + this.returnrequest.orderId;
    if (this.step === 1) {
      this.returnrequest.orderItems.forEach(item => {
        item.UploadText = 'Please add a picture';
        item.intialUploadText = 'Please add a picture';
        item.IsSelected = false;
        item.intialUploadUrl = 'https://files.y.jewelry/testminoalupload.png';
        if (!item.isReturnAble) {
          item.IsSelected = false;
        }
        item.quantityIndex = 1;
        this.orderitems.push(item);
      }); // End of ForEach Function
      this.orderitems = this.createRange(this.orderitems);
      this.isAllSelected = true;
      this.SelectAll(this.isAllSelected);
    } else {
      this.orderitems = this.createRange(this.returnrequest.orderItems);
      this.dataSource = new MatTableDataSource(this.orderitems.filter(x => x.IsSelected === true));
    }
    this.profileService.FetchOrderSettings()
    .subscribe(settings => {
      if (settings) {
        this.returnAmountChange =  settings.ReturnOrReplaceCharged;
      }
    });

  }
  OnStatusReasonChanged(requestReturnItem: RequestReturnItem) {
    if (requestReturnItem.selectedReason.Name === 'Size is not Ok') {
          requestReturnItem.showfold = 2;
        } else {
          requestReturnItem.showfold = 3;
        }
  }
  handleFileInput(file: FileList, requestReturnItem: RequestReturnItem) {
    requestReturnItem.fileToUpload = file.item(0);
    if (!file.item(0)) {
      requestReturnItem.UploadText = requestReturnItem.intialUploadText;
      return;
     }
    const mimeType = file[0].type;
    if (mimeType.match(/image\/*/) == null) {
      requestReturnItem.error = 'Only images are supported.';
      return;
    }
    requestReturnItem.isFileUploading = true;
    const formData = new FormData();
    formData.append('formFile', requestReturnItem.fileToUpload);
    this.profileService.uploadPicture(formData).subscribe(res => {
      requestReturnItem.isFileUploading = false;
      if (res.success) {
        requestReturnItem.UploadText = requestReturnItem.fileToUpload.name;
        requestReturnItem.fileUploadId = res.data;
        requestReturnItem.error = null;
        requestReturnItem.message = 'Uploaded Successfully';
      } else {
      requestReturnItem.error = 'Upload Error Please Contact Admin';
      // requestReturnItem.message = 'Upload Error Please Contact Admin';
      }
      requestReturnItem.showfold = 4;
    });

  }
  changeOrderAttribute(attr: Attribute, requestReturnItem: RequestReturnItem, event: any) {
  //  var id_valuePair= orderItem.product_attributes.find(x=>x.id===attr.id);
  //  if(id_valuePair){
  //   id_valuePair.value=event;
  //  }
  // orderItem.
  }
  SelectAll(value) {
    if (value) {
      this.orderitems.filter(x => x.isReturnAble === true).forEach(item => {
         item.IsSelected = true;
       }
       );
    } else {
      this.orderitems.filter(x => x.isReturnAble === true).forEach(item => {
          item.IsSelected = false;
        });
    }
  }
  SelectedEachCheckBox(id, quantity: number, value: boolean) {

    this.orderitems.find(x => x.orderItem.id === id && x.quantityIndex === quantity).IsSelected = value;
    if (this.orderitems.filter(x => x.IsSelected === true).length === this.getAllReturnable().length) {
      this.isAllSelected = true;
    } else {
      this.isAllSelected = false;
    }
  }
  getAllReturnable() {
    return this.orderitems.filter(x => x.isReturnAble === true);
  }
  PreviewReturnRequest() {
      if (this.orderitems.filter(x => x.IsSelected === true).length > 0) {
        this.iserror = false;
        this.dataSource = new MatTableDataSource(this.orderitems.filter(x => x.IsSelected === true));
        this.step = 2;
      } else {
        this.iserror = true;
        this.error = 'Please Select At Least One Item to Return or Replace ';
      }
  }
  SubmitReturnRequest() {
    const ReturnItems1: ItemSubmitRequestDto[] = [];
    this.orderitems.filter(x => x.IsSelected === true).forEach(item => {
     ReturnItems1.push({
       itemId: item.orderItem.id,
       productId: item.orderItem.product_id,
       quantity: item.quantityIndex,
       reasonForReturnId: item.selectedReason.Id,
       requestedActionId: item.selectedAction.Id,
       comments: item.comment,
       uploadFileId: item.fileUploadId,
       newSize: item.newSize
    });
   });
    const submitRequest: SubmitReturnRequestDto = {
      orderId: this.returnrequest.orderId,
      orderItems: ReturnItems1
    };
    this.profileService.postReturnRequest(submitRequest).subscribe(res => {
      if (res.success) {
        this.step = 3;
        this.isSuccessscreen = true;
        this.iserror = false;
      } else {
        this.iserror = true;
        this.error = res.message;
      }
    });

  }
  createRange(orderitems: RequestReturnItem[]) {
    const items: RequestReturnItem[] = [];
    orderitems.forEach(item => {
      for (let i = 1; i <= item.orderItem.quantity; i++) {

        const tempmodel: RequestReturnItem = {
          orderItem: item.orderItem,
          isReturnAble: item.isReturnAble,
          IsSelected: item.IsSelected,
          selectedAction: item.selectedAction,
          selectedReason: item.selectedReason,
          comment: item.comment,
          fileToUpload: item.fileToUpload,
          intialUploadText: item.intialUploadText,
          intialUploadUrl: item.intialUploadUrl,
          quantityIndex: i,
          message: item.message,
          UploadText: item.UploadText,
          fileUploadId: item.fileUploadId,
          isFileUploading: false,
          IsBrecelet: false,
          newSize: null,
          error: null,
          showfold: 1
        };
        if (item.orderItem.product.attributes.filter(x => (x.product_attribute_name) === 'Size in cm').length > 0) {
          tempmodel.IsBrecelet = true;

        }
        items.push(tempmodel);
      }
    });
    return items;
  }
}
