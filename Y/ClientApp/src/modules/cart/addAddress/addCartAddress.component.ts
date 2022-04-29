import {
  Component,
  OnDestroy,
  OnInit,
  Inject,
  ElementRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressesItem } from 'src/store/Customer/customer.model';
import { PincodeDataModel } from 'src/store/yjStoreModels/PincodeData.model';
import { CartService } from '../../../services/cart.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
  FormControl
} from '@angular/forms';
import { CustomerStoreService } from 'src/store/customerStore.service';

@Component({
  selector: 'app-add-cart-address',
  templateUrl: './addCartAddress.component.html',
  styleUrls: ['./addCartAddress.component.scss']
})
export class AddAddressCartComponent implements OnDestroy, OnInit {
  public selectedAction = 0;

  // errors
  public showRequiredFieldsAddress = false;
  public pincodeNotCorrect = false;
  public fieldsRequiredMissing = 'Fill all the required Fields.';

  public password: string;
  public cPassword: string;
  public states = [];

  public form: FormGroup;
  public zipcodeValueSubcription = '';
  public IsCityReadOnly= false;
  public IsStateReadOnly= false;
  constructor(
    private cartService: CartService,
    private el: ElementRef,
    private customerStore: CustomerStoreService,
    public dialogRef: MatDialogRef<AddAddressCartComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { address: AddressesItem; type: number, isBilling: boolean }
  ) {
    const tempCustomer = this.customerStore.getCustomer();
    const first_name = data.address.first_name || tempCustomer.first_name;
    const last_name = data.address.last_name || tempCustomer.last_name;
    const email = data.address.email || tempCustomer.email;
    const phone_number = data.address.phone_number || tempCustomer.mobile;

    this.form = this.fb.group({
      id: [data.address.id],
      first_name: [first_name, Validators.required],
      last_name: [last_name, Validators.required],
      email: [
        email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,50}$')
        ])
      ],
      company: [data.address.company],
      country_id: [133, Validators.required],
      country: ['India', Validators.required],
      state_province_id: [data.address.state_province_id, Validators.required],
      city: [data.address.city, Validators.required],
      address1: [data.address.address1, Validators.required],
      address2: [data.address.address2],
      zip_postal_code: [
        data.address.zip_postal_code,
        Validators.compose([this.formValidator(), Validators.required])
      ],
      phone_number: [
        phone_number,
        Validators.compose([Validators.minLength(10), Validators.required])
      ],
      fax_number: [data.address.fax_number],
      customer_attributes: [data.address.customer_attributes]
    });
    this.form.get('country').disable();

    const css =
      // tslint:disable-next-line: max-line-length
      '.mat-dialog-container {padding: 24px !important;background: #fcf4f0 !important;border: none !important;} @media (max-width: 669px) { .cdk-global-overlay-wrapper { bottom: 10px !important; top: unset; align-items: flex-end !important; } .mat-dialog-content{ max-height: calc(65vh - 20px) !important; } .mat-dialog-container { max-height: calc(100vh - 90px) !important; } }';
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'custom-cdk-overlay-pane';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  ngOnInit() {
    this.cartService.getStates().subscribe(value => {
      if (value) {
        this.states = value;
      }
    });

  }

  get isValid(): boolean {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
      return false;
    }

    return true;
  }


  formValidator(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      const errors: ValidationErrors = {};
      if (control.value) {
        if (control.value.length !== 6) {
          control.setErrors({
            zipCode: {
              message: 'Enter valid Postal Code.'
            }
          });
        } else if (this.zipcodeValueSubcription !== control.value) {
          this.zipcodeValueSubcription = control.value;
          this.cartService
            .getPincodeData(control.value)
            .subscribe((value: PincodeDataModel) => {
              if (value.PostOffice) {
                if (this.form) {
                  this.form.patchValue({ city: value.PostOffice[0].District });
                }
                this.IsCityReadOnly = true;
                if (this.states) {
                  const selectedState = this.states.find(
                    item =>
                      item.name.toLowerCase() ===
                      value.PostOffice[0].State.toLowerCase()
                  );
                  if (selectedState && this.form) {
                    this.form.patchValue({
                      state_province_id: selectedState.id
                    });

                    control.updateValueAndValidity();
                  }
                  this.IsStateReadOnly = true;
                }
              } else {
                // control.setErrors({
                //   zipCode: {
                //     message: "Enter valid Postal Code."
                //   }
                // });
                this.IsCityReadOnly = false;
                this.IsStateReadOnly = false;

              }
            });
        }
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close({ success: false });
  }

  saveAddress() {
    if (this.isValid) {
      this.cartService.addAddress(this.form.value, this.data.isBilling).subscribe(res => {
        if (res) {
          this.dialogRef.close({ success: true });
        }
      });
    } else {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]'
          );
          if (invalidControl) {
            invalidControl.focus();
          }
          document.activeElement.scrollIntoView();
          break;
        }
      }
    }
  }

  ngOnDestroy() {
    const styleEl = document.getElementById('custom-cdk-overlay-pane');
    if (styleEl) {
      styleEl.remove();
    }
  }
}
