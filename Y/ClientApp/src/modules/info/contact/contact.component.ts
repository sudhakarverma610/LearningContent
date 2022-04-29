import { Component, OnInit } from '@angular/core';
import { InfoService } from '../info.service';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public nameFormContactError;
  public emailFormContactError;
  public emailFormContactRequiredError;
  public emailInvalidFormContactError;
  public firstnameFormContactError;

  public showRequiredFieldsContact;

  public nameFormContact;
  public emailFormContact;
  public firstnameFormContact;
  public required;
  public subject;
  public allowContactForm: boolean =false;
  public successMessage; 
  public companyName = 'Ripops India Jewellery Pvt Ltd';
  public companyAddress = 'Gurgaon';
  public telphone = '0124-2380003';
  public whatsApp = '9810230784';
  public email = 'contact@y.jewelry';  constructor(
    private appService: AppService,
    private infoService: InfoService
      ) {
    this.appService.isBrowser
      ? this.appService.loader.next(false)
      : console.log();

    this.infoService.successMessageSubject.subscribe(value => {
      if (value) {
        this.successMessage = true;
      }
    });
  }

  ngOnInit() {
    this.appService.isBrowser ? window.scrollTo(0, 0) : console.log();
    this.infoService.getCurrentStore().subscribe(res => {
      this.allowContactForm = res.isContactUsFormEnabled;
    });
  }

  submitContact() {
    if (
      this.firstnameFormContact == null ||
      this.nameFormContact == null ||
      this.emailFormContact == null ||
      this.firstnameFormContact === '' ||
      this.nameFormContact === '' ||
      this.emailFormContact === ''
    ) {
      this.showRequiredFieldsContact = true;
      if (this.nameFormContact == null || this.nameFormContact === '') {
        this.nameFormContactError = true;
      } else {
        this.nameFormContactError = false;
      }
      if (
        this.firstnameFormContact == null ||
        this.firstnameFormContact === ''
      ) {
        this.firstnameFormContactError = true;
      } else {
        this.firstnameFormContactError = false;
      }
      if (this.emailFormContact == null || this.emailFormContact === '') {
        this.emailFormContactError = true;
        this.emailFormContactRequiredError = true;
        this.emailInvalidFormContactError = false;
      } else {
        this.emailFormContactError = false;
        this.emailFormContactRequiredError = false;
      }

      return false;
    } else {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(this.emailFormContact)) {
        this.emailInvalidFormContactError = false;
        this.showRequiredFieldsContact = false;
        this.emailFormContactError = false;
        this.firstnameFormContactError = false;
        this.nameFormContactError = false;
        this.emailFormContactRequiredError = false;
        const data = {
          email: this.emailFormContact,
          fullname: this.nameFormContact + this.firstnameFormContact,
          subject: this.required,
          enquiry: this.subject
        };
        this.infoService.sendContactUsMessage(data).subscribe(value => {
          this.successMessage = true;
          this.firstnameFormContact = undefined;
          this.nameFormContact = undefined;
          this.emailFormContact = undefined;
          this.subject = undefined;
        });
      } else {
        this.emailInvalidFormContactError = true;
        this.emailFormContactError = false;
        this.emailFormContactError = true;
        this.emailFormContactRequiredError = false;
      }
    }
  }
}
