import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { AppService } from './app.service';

class ScrollPosition {
  public id: any;
  public x: number;
  public y: number;
  constructor(id: any, x_position: number, y_position: number) {
    this.id = id;
    this.x = x_position;
    this.y = y_position;
  }
}

@Injectable()
export class ScrollStoreService {
  public componentScrollPosition: ScrollPosition[] = [];
  public previousComponent;
  public previousComponentPage;
  public saveShowMoreForHome: {
    category_sename: string;
    showMoreActive: boolean;
  };

  private supportPageOffset;
  private isCSS1Compat;
  public document;

  constructor(@Inject(DOCUMENT) document: any, private appService: AppService) {
    this.document = document;
    this.isCSS1Compat = (this.document.compatMode || "") === "CSS1Compat";
    if (this.appService.isBrowser) {
      this.supportPageOffset = window.pageXOffset !== undefined;
    }
  }

  saveScrollPostion(id) {
    if (this.appService.isBrowser) {
      let x, y, position;
      x = this.supportPageOffset
        ? window.pageXOffset
        : this.isCSS1Compat
        ? this.document.documentElement.scrollLeft
        : this.document.body.scrollLeft;
      y = this.supportPageOffset
        ? window.pageYOffset
        : this.isCSS1Compat
        ? this.document.documentElement.scrollTop
        : this.document.body.scrollTop;
      position = new ScrollPosition(id, x, y);

      function findPositionObj(element) {
        return element.id === id;
      }

      const findPositionObjIndex = this.componentScrollPosition.findIndex(
        findPositionObj
      );
      if (x === 0 && y === 0) {
        return;
      }
      if (findPositionObjIndex !== -1) {
        this.componentScrollPosition.splice(findPositionObjIndex, 1);
        this.componentScrollPosition.push(position);
      } else {
        this.componentScrollPosition.push(position);
      }
    }
  }

  restoreScroll(id) {
    if (this.appService.isBrowser) {
      const position = this.componentScrollPosition.find(element => {
        return element.id === id;
      });
      const scroll = (x_pos, y_pos) => {
        setTimeout(function() {
          window.scrollTo({
            top: y_pos,
            left: x_pos,
            behavior: "smooth"
          });
        }, 400);
      };
      if (position) {
        scroll(position.x, position.y);
      } else {
        scroll(0, 0);
      }
    }
  }
}
