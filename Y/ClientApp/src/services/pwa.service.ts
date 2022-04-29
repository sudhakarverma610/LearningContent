import { Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { AppService } from "./app.service";
@Injectable()
export class PwaService {
  public promptEvent;

  constructor(private swUpdate: SwUpdate, private appService: AppService) {
    // swUpdate.available.subscribe(event => {
    //   if (askUserToUpdate()) {
    //     window.location.reload();
    //   }
    // });
    if (this.appService.isBrowser) {
      window.addEventListener("beforeinstallprompt", (event: any) => {
        event.prompt();
      });
    }
  }
}
