import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguratorService } from 'src/modules/configurator/configurator.service';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy, OnInit {
  constructor(private configuratorService: ConfiguratorService,
              private appService: AppService) {}

  ngOnInit() {
    this.appService.isBrowser ? window.scrollTo(0, 0) : console.log();
  }
  openConfigurator() {
    this.configuratorService.OpenConfigureWindow.next(true);
  }
  ngOnDestroy() {}
}
