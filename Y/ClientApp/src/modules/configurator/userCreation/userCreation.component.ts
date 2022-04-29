import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UserCreation } from '../modal/userCreation.model';
import { UserCreationService } from '../userCreation.service';

@Component({
  selector: 'app-userCreation',
  templateUrl: './userCreation.component.html',
  styleUrls: ['./userCreation.component.scss']
})
export class UserCreationComponent implements OnInit {
  @Input()
  userCreation: UserCreation;
  @Output()
  OnShareImageEvent = new EventEmitter<UserCreation>();
  @Output()
  OnDownloadEvent = new EventEmitter<UserCreation>();
  @Output()
  OnSelectedUserCreationEvent = new EventEmitter<UserCreation>();
  @Output()
  OnRemoveEvent = new EventEmitter<UserCreation>();
  public baseUrl = '';
  public IsShareAble = false;
  constructor( @Inject('BASE_API_URL') baseUrl: string
  ) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
  }
  imageClick() {
    this.OnSelectedUserCreationEvent.emit(this.userCreation);
  }
  ShareUserCreation() {
    this.OnShareImageEvent.emit(this.userCreation);
  }
  downLoadImage() {
    this.OnDownloadEvent.emit(this.userCreation);
  }
  RemoveUserCreation() {
    this.OnRemoveEvent.emit(this.userCreation);
  }
}
