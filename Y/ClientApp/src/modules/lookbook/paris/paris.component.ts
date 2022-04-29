import { Component, OnInit } from "@angular/core";
import { InViewportMetadata } from "ng-in-viewport";
import { MetaService } from 'src/services/meta.service';
import { AppService } from 'src/services/app.service';

@Component({
  selector: "app-paris",
  templateUrl: "./paris.component.html",
  styleUrls: ["./paris.component.scss"]
})
export class ParisComponent implements OnInit {
  unmute = true;
  constructor(
    private metaService: MetaService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.metaService.setMeta(
      "Lookbook A Day In Paris | Y Jewelry",
      "Shop 925 sterling silver jewelry like charms, bracelets, neckchains, hoops, online. 100% Secure Payments. Fast Delivery. Order now.",
      "Sterling Silver Jewelry, Silver Jewellery, 925 Sterling Silver, Gold Plated Jewellery, Rose Gold Plated Jewelery",
      this.appService.baseUrl + "lookbook",
      "https://files.y.jewelry/assets/img/metaImage.jpeg"
    );
  }

  onIntersection($event) {
    const {
      [InViewportMetadata]: { entry },
      target
    } = $event;
    const ratio = entry.intersectionRatio;
    const vid = target;

    ratio >= 0.65 ? vid.play() : vid.pause();
  }

  public changeVideoAudio(id: string) {
    const vid: any = document.getElementById(id);
    vid.muted = !vid.muted;
    this.unmute = false;
  }
}
