import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormObject } from './mauticForm.model';

@Component({
    selector: 'app-review',
    templateUrl: 'review.component.html',
    styleUrls: ['review.component.scss']
})

export class ReviewComponent implements OnInit {
    mauticForm: FormObject;
    mauticformvalue: any;
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.mauticForm = this.route.snapshot.data.data;
    }
}