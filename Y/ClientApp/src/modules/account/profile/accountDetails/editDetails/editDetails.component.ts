import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from 'src/store/Customer/customer.model';
import { ProfileService } from '../../profile.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  FormControl,
  ValidationErrors
} from '@angular/forms';

@Component({
  selector: 'app-edit-details',
  templateUrl: './editDetails.component.html',
  styleUrls: ['./editDetails.component.scss']
})
export class EditDetailsComponent implements OnDestroy, OnInit {
  public selectedAction = 0;

  // errors
  public firstnameFormAddressError = false;
  public nameFormAddressError = false;
  public passwordFormAddressError = false;
  public emailFormAddressError = false;
  public emailValidFormAddressError = false;

  public password: string;
  public cPassword: string;

  public showPassword1 = false;
  public showPassword2 = false;
  public form: FormGroup = new FormGroup({});

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: Customer }
  ) {
    this.form = this.fb.group({
      id: [data.customer.id],
      first_name: [data.customer.first_name, Validators.required],
      last_name: [data.customer.last_name, Validators.required],
      email: [
        data.customer.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ])
      ],
      gender: [data.customer.gender],
      date_of_birth: [data.customer.date_of_birth],
      mobile: [
        data.customer.mobile,
        Validators.compose([Validators.minLength(10), Validators.maxLength(13), Validators.required])
      ],
      password: [null],
      cPassword: [null, Validators.compose([this.formValidator()])]
    });
    const css =
    // tslint:disable-next-line: max-line-length
    '.mat-dialog-container {padding: 24px !important;background: #fcf4f0 !important;border: none !important;}';
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'custom-cdk-overlay-pane';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
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
      const password = this.form.get('password');
      const cPassword = this.form.get('cPassword');
      if (cPassword && password) {
        if (cPassword.value !== password.value) {
          errors.password = {
            message: 'Password does not match. Please Re Enter the values.'
          };
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

  saveDetails() {
    if (this.isValid) {
      const data = {
        Id: parseInt(this.form.get('id').value, 10),
        first_name: this.form.get('first_name').value,
        last_name: this.form.get('last_name').value,
        email: this.form.get('email').value,
        date_of_birth: this.form.get('date_of_birth').value,
        gender: this.form.get('gender').value,
        mobile: this.form.get('mobile').value,
        password: this.form.get('password').value
      };
      this.profileService.editProfile(data).subscribe(res => {
        if (res) {
          this.dialogRef.close({ success: true });
        }
      });
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    const styleEl = document.getElementById('custom-cdk-overlay-pane');
    if (styleEl) {
    styleEl.remove();
  }
}
}
