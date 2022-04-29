export class GiftCardCategory {
  catId: string;
  id: string;
  img: string;
  num: number;
  txt: string;
  description: string;
  se_name: string;

  constructor(Input: any) {
    if (Input.id === Input.parent) {
      this.num = 1;
    } else {
      this.num = Input.num;
    }
    this.catId = Input.id;
    this.id = 'element' + this.num;
    this.txt = Input.name;
    this.description = Input.description;
    this.se_name = Input.se_name;
    this.img = Input.image ? Input.image.src : 'https://files.y.jewelry/assets/img/Logo.svg';
  }
}

export class GiftCard {
  id: number;
  title: string;
  src: string;
  se_name: string;
  isCustomerEnteredPrice: boolean;
  price: number;

  constructor(Input: any) {
    this.id = parseInt(Input.id, 10);
    this.title = Input.name;
    this.src =
      Input.images.length > 0
        ? Input.images[0].src
        : 'https://files.y.jewelry/assets/img/Logo.svg';
    this.se_name = Input.se_name;
    this.isCustomerEnteredPrice = Input.customer_enters_price;
    this.price = Input.price;
  }
}
