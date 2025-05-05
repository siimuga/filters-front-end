import { Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../shared/api.service";
import {AllFilters} from './module/all-filters';
import {NgForOf, NgIf} from '@angular/common';
import { Modal } from 'bootstrap';
import {AddFilterComponent} from '../add-filter/add-filter.component';
import {AddFilterBoxComponent} from '../add-filter-box/add-filter-box.component';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-all-filters',
  imports: [
    NgIf,
    NgForOf,
    AddFilterComponent,
    AddFilterBoxComponent,
    FormsModule
  ],
  templateUrl: './all-filters.component.html',
  styleUrl: './all-filters.component.css'
})
export class AllFiltersComponent implements OnInit {
  filters: AllFilters[] = [];
  showAddFilter :boolean = false;
  showAddFilterBox :boolean = false;
  showSuccessAlert :boolean = false;
  isSwitchOn:boolean = true;

  constructor(private apiService:ApiService) {
  }

  @ViewChild(AddFilterComponent)
  addFilterComponent!: AddFilterComponent;

  @ViewChild(AddFilterBoxComponent)
  addFilterBoxComponent!: AddFilterBoxComponent;

  ngOnInit() {
    this.findAllFilters();
  }

  openAddFilterl() {
    this.showSuccessAlert = false;
    if (this.isSwitchOn) {
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
    } else {
      this.showAddFilterBox = false;
      setTimeout(() => this.showAddFilterBox = true, 0);
      setTimeout(() => {
        this.addFilterBoxComponent.loadInitialData();
      });
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

  onCloseAddFilterBox() {
    this.showAddFilterBox = false;
  }

  onCloseAddFilterModal() {
    this.showAddFilter = false;
  }

  onCloseAfterSent() {
    this.showAddFilterBox = false;
    this.showAddFilter = false;
    this.findAllFilters();
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }
}
