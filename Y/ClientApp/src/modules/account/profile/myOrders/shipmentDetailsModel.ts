export class ShipmentDetailsModel {
  public id: number;
  public trackingNumber: string;
  public trackingNumberUrl: string;
  public shippingDate: string;
  public deliveryDate: string;
  public productsName:string[];
  public shippingStatusEvents: ShipmentStatusEventsModel;

  constructor(input) {
    this.id = input.Id;
    this.trackingNumberUrl = input.trackingNumberUrl;
    this.trackingNumber = input.trackingNumber;
    this.shippingDate = input.shippingDate;
    this.deliveryDate = input.deliveryDate;
    this.productsName=input.productsName;
    this.shippingStatusEvents = input.shippingStatusEvents.map(element => {
      return new ShipmentStatusEventsModel(element);
    });
  }
}

export class ShipmentStatusEventsModel {
  public eventName: string;
  public location: string;
  public country: string;
  public date: string;

  constructor(input) {
    this.eventName = input.eventName;
    this.location = input.location;
    this.country = input.country;
    this.date = input.date;
  }
}
