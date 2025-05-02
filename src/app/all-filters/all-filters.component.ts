import { Component, OnInit } from '@angular/core';
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

  constructor(private apiService:ApiService) {
  }

  ngOnInit() {
    this.findAllFilters();
  }

  openModal() {
    const modalElement = document.getElementById('filterModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
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
