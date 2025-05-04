import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {importProvidersFrom} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BsDatepickerModule.forRoot()),
    provideAnimations(),
    ...(appConfig.providers || [])
  ]
}).catch(err => console.error(err));
