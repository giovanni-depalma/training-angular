import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // HttpClient abilitato per i servizi; le chiamate passeranno dal dev proxy (/api -> backend)
    provideHttpClient(
      withInterceptors([
        // spazio per eventuali interceptor (log, error handling)
      ])
    )
  ]
};
