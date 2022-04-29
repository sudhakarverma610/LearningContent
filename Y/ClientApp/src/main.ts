import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import "hammerjs";
import { environment } from "./environments/environment";
import { StatusCodeService } from './services/statusCode.service';
import { ABTestingService } from './services/abtesting.service';

export function getBaseUrl() {
  const url = document.getElementsByTagName("base")[0].href;
  return url;
}

export function getBaseApiUrl() {
  const url = document.getElementById("baseApiUrl").getAttribute("name");
  return url;
}

export function statusCodeService() {
  return new StatusCodeService();
}

export function abtestingService() {
  const temp = new ABTestingService();
  temp._testingVariable = Number(
    document.getElementById("abtestingVariable").getAttribute("name")
  );
  return temp;
}

const providers = [
  { provide: "BASE_URL", useFactory: getBaseUrl, deps: [] },
  { provide: "BASE_API_URL", useFactory: getBaseApiUrl, deps: [] },
  { provide: StatusCodeService, useFactory: statusCodeService, deps: [] },
  { provide: ABTestingService, useFactory: abtestingService, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

document.addEventListener("DOMContentLoaded", () => {
  platformBrowserDynamic(providers)
    .bootstrapModule(AppModule)
    .then(() => {
      // if ("serviceWorker" in navigator && environment.production) {
      //   navigator.serviceWorker.register("./ngsw-worker.js");
      // }
    })
    .catch(err => console.log(err));
});
