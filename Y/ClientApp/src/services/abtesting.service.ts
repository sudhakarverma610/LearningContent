import { Injectable } from "@angular/core";
import { makeStateKey, TransferState } from "@angular/platform-browser";
import { Subject } from "rxjs";

const ABTESTINGVARIABLE = makeStateKey("abtestingvariable");
@Injectable()
export class ABTestingService {
  public _testingVariable = 1;

  public get testingVariable() {
    return this._testingVariable;
  }

  public set testingVariable(input) {
    this._testingVariable = input;
    this.newStateSet.next(true);
  }

  public newStateSet: Subject<boolean> = new Subject();

  constructor() {}
}
