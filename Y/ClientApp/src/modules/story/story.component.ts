import { Component, OnInit, Optional, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StoryService } from "./story.service";
import { MetaService } from "../../services/meta.service";
import { Location, APP_BASE_HREF } from "@angular/common";

@Component({
  selector: "app-story",
  templateUrl: "./story.component.html",
  styleUrls: ["./story.component.scss"],
  providers: [MetaService]
})
export class StoryComponent implements OnInit {
  public productsSku;
  public products = [];
  public metaImageUrl = "";

  public baseUrl;
  public location: Location;

  constructor(
    private route: ActivatedRoute,
    private storyService: StoryService,
    private metaService: MetaService,
    location: Location,
    @Optional()
    @Inject(APP_BASE_HREF)
    origin: string
  ) {
    this.baseUrl = origin ? origin : "";
    this.location = location;
  }

  ngOnInit() {
    this.products = [];
    this.productsSku = this.route.snapshot.data.result.randomProductsList;
    this.metaImageUrl = this.route.snapshot.data.result.url;
    this.metaService.setMeta(
      undefined,
      undefined,
      undefined,
      this.baseUrl + this.location.path(),
      this.metaImageUrl
    );
    this.productsSku.forEach(sku => {
      this.storyService.getProductForStory(sku).subscribe(value => {
        this.products.push(value);
      });
    });
  }

  toProduit(se_name) {}

  share() {}
}
