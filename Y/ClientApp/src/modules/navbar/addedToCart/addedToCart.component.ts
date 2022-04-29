import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShoppingCartsItem } from 'src/store/cart/ShoppingCart.model';
import { AttributeValue } from 'src/store/products/products.model';
import { NavService } from '../navService.service';
import { CartService } from 'src/services/cart.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './addedToCart.component.html',
  styleUrls: ['./addedToCart.component.scss']
})
export class AddToCartComponent implements OnInit, OnDestroy {
  availableForPreOrder = false;

  constructor(
    public dialogRef: MatDialogRef<AddToCartComponent>,
    private cartService: CartService,
    @Inject(MAT_DIALOG_DATA) public data: { item: ShoppingCartsItem }
  ) {
    const css =
    '.mat-dialog-container { padding: 24px !important;}';
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'custom-cdk-overlay-pane';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
    const temp = this.setItemImage(this.data.item);
    this.data.item = this.setUpProductAttributes(temp);
    try {
      this.availableForPreOrder = data ? data.item.product.available_for_pre_order : false;
    } catch (err) {}
  }

  ngOnInit() {
    this.dialogRef.updatePosition({ top: '80px', right: '10px' });
    this.dialogRef.addPanelClass('bg-white');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setItemImage(input: ShoppingCartsItem) {
    const item = { ...input };
    return item;
  }

  prepareFontList(item: AttributeValue) {
    const indexOfUrlToken = item.name.indexOf('$');
    if (indexOfUrlToken !== -1) {
      item.name = item.name.substring(0, indexOfUrlToken);
      return item;
    }
    return item;
  }

  setUpProductAttributes(input: ShoppingCartsItem) {
    const attributes = [];
    const customizationAttributes = [];
    if (input.product_attributes && input.product_attributes.length > 0) {
      input.product_attributes.forEach(item => {
        const foundItem = input.product.attributes.find(
          item2 => item2.id === item.id
        );
        if (
          foundItem &&
          foundItem.attribute_control_type_name !== 'ImageSquares'
        ) {
          if (foundItem.attribute_control_type_name === 'TextBox') {
            if (
              foundItem.product_attribute_name.indexOf('Customization') !== -1
            ) {
              customizationAttributes.push({
                ...foundItem,
                textBoxInput: item.value,
                active: false,
                attributeInputSelected: null
              });
            } else {
              if (
                foundItem.product_attribute_name.substring(0, 11) !==
                'Association'
              ) {
                attributes.push({
                  ...foundItem,
                  textBoxInput: item.value,
                  active: false,
                  attributeInputSelected: null
                });
              }
            }
          } else {
            const preSelected =
              foundItem.attribute_values.find(
                attributeValue => attributeValue.id.toString() === item.value
              ) || foundItem.attribute_values[0];

            if (
              foundItem.product_attribute_name.indexOf('Customization') !== -1
            ) {
              customizationAttributes.push({
                ...foundItem,
                textBoxInput: '',
                active: false,
                attributeInputSelected: this.prepareFontList(preSelected)
              });
            } else {
              if (
                foundItem.product_attribute_name.substring(0, 11) !==
                'Association'
              ) {
                attributes.push({
                  ...foundItem,
                  textBoxInput: '',
                  active: false,
                  attributeInputSelected: preSelected
                });
              }
            }
          }
        }
      });
    }
    return { ...input, attributes, customizationAttributes };
  }

  decreaseQuantity(item: ShoppingCartsItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.update({ ...item, id: '0', quantity: -1 });
    }
  }

  increaseQuantity(item: ShoppingCartsItem) {
    item.quantity += 1;
    this.update({ ...item, id: '0', quantity: 1 });
  }

  update(item: ShoppingCartsItem) {
    const updateCartItemObject: any = {};
    updateCartItemObject.id = item.id;
    updateCartItemObject.productId = item.product.id;
    updateCartItemObject.quantity = item.quantity;
    updateCartItemObject.attributesSelected = item.product_attributes;
    this.updateCartItem(updateCartItemObject);
  }

  updateCartItem(cartItemData: {
    id: string;
    productId: string;
    quantity: number;
    attributesSelected: { id: number; value: string }[];
  }) {
    const data = {
      gift_card_attributes: null,
      product_id: parseInt(cartItemData.productId, 10),
      cart_type_id: 1,
      cart_item_id: cartItemData.id,
      quantity: cartItemData.quantity,
      updatecartitem: true,
      attributes: cartItemData.attributesSelected,
      customer_entered_price: 0
    };
    this.cartService.pushToCart.next(data);
  }
  ngOnDestroy() {
    const styleEl = document.getElementById('custom-cdk-overlay-pane');
    if (styleEl) {
      styleEl.remove();
    }
  }

}
