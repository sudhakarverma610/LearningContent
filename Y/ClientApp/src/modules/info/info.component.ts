import { Component, OnInit, OnDestroy } from '@angular/core';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  providers: [MetaService]
})
export class InfoComponent implements OnInit, OnDestroy {
  public document;
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
