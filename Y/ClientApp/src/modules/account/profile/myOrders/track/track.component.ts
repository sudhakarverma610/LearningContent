import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"; 
import { ProfileService } from "../../profile.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  FormControl,
  ValidationErrors
} from "@angular/forms";

import { ShipmentDetailsModel } from '../../myOrders/shipmentDetailsModel';

@Component({
  selector: "app-track-details",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.scss"]
})
export class TrackComponent implements OnDestroy, OnInit {

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TrackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { value : ShipmentDetailsModel[] }
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close({ success: false });
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
