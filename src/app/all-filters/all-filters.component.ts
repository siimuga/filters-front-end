import { Component, OnInit } from '@angular/core';
import {ApiService} from "../shared/api.service";
import {AllFilters} from './module/all-filters';
import {NgForOf, NgIf} from '@angular/common';
import { Modal } from 'bootstrap';
import {AddFilterComponent} from '../add-filter/add-filter.component';

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

  public findAllFilters() {
    this.apiService.findAllFilters().subscribe(
      res=>{
        this.filters = res;
      },
      err=> {
        alert("An error occurred")
      }
    )
  }

}
