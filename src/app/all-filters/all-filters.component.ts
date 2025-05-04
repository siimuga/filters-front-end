import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../shared/api.service";
import {AllFilters} from './module/all-filters';
import {NgForOf, NgIf} from '@angular/common';
import { Modal } from 'bootstrap';
import {AddFilterComponent} from '../add-filter/add-filter.component';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-all-filters',
  imports: [
    NgIf,
    NgForOf,
    AddFilterComponent
  ],
  templateUrl: './all-filters.component.html',
  styleUrl: './all-filters.component.css'
})
export class AllFiltersComponent implements OnInit {
  filters: AllFilters[] = [];
  showAddFilter :boolean = false;

  constructor(private apiService:ApiService) {
  }

  @ViewChild(AddFilterComponent)
  addFilterComponent!: AddFilterComponent;

  ngOnInit() {
    this.findAllFilters();
  }

  openModal() {
    this.showAddFilter = false;
    setTimeout(() => this.showAddFilter = true, 0);
    setTimeout(() => {
      this.addFilterComponent.loadInitialData();
      const modalEl = document.getElementById('filterModal');
      if (modalEl) {
        const bsModal = new Modal(modalEl);
         bsModal.show();
      }
    });
  }

  private findAllFilters(): void {
    this.apiService.findAllFilters().pipe(
      catchError((err) => {
        console.error('Failed to load filters', err);
        return of([]);
      })
    ).subscribe(
      (res) => {
        this.filters = res;
      }
    );
  }

}
