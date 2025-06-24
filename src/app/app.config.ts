// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes'; // <-- Keep this import
import { ApiService } from './services/api.service';
import { withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    ApiService,
    provideRouter(routes), // <-- This is where your routes are provided
    provideHttpClient(withFetch()),
    provideAnimations() // <-- This is for animations support
  ]
};