import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-homeAboutUs',
  templateUrl: './homeAboutUs.component.html',
  styleUrls: ['./homeAboutUs.component.scss']
})
export class HomeAboutUsComponent implements OnInit {
  @Input('content')
  public contents;
  public desktop=false;
  constructor(private appService:AppService) { 

  }

  ngOnInit() {
    this.desktop=this.appService.isBrowser;
  }

}
