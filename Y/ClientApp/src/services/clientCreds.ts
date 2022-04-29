import { InjectionToken } from '@angular/core';

// injection token used to inject the client credentials on the app bootstrap at server side
export const CLIENT_CREDENTIALS = new InjectionToken<string>(
  'CLIENT_CREDENTIALS'
);
