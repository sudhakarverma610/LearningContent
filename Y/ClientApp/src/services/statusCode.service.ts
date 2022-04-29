import { Injectable } from "@angular/core";

@Injectable()
export class StatusCodeService {
  public statusCode: number = 200;
  public url: string;
  public usage: string;
  public token: string;
  public tokenError: any;
  public tokenCreds: any;
  public error: any;
  public steps: string[] = [];

  constructor() {}

  getStatusCode() {
    return {
      code: this.statusCode,
      url: this.url,
      usage: this.usage,
      token: this.token,
      tokenError: this.tokenError,
      tokenCreds: this.tokenCreds,
      error: this.error,
      steps: this.steps
    };
  }
}
