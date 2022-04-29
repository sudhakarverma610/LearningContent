import { Component, Input } from '@angular/core';
import { breadcrumb } from './breadcrumb.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input()
  breadcrumbList: breadcrumb[] = [];
  constructor() {}
}
  