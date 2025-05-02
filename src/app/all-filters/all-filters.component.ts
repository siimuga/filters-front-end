import { Component, OnInit } from '@angular/core';
import {ApiService} from "../shared/api.service";
import {AllFilters} from './module/all-filters';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-all-filters',
  imports: [
    NgIf,
    NgForOf
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
