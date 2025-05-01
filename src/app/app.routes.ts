import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AllFiltersComponent } from './all-filters/all-filters.component';

export const routes: Routes = [
  {
    path:'',
    component:AllFiltersComponent
  },
  {
    path:'**',
    component:NotFoundComponent
  }
];
