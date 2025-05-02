import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AllFilters} from "../all-filters/module/all-filters";


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = "http://localhost:8080/api";
  private ALL_FILTERS_URL = `${this.BASE_URL}/filters`;

  constructor(private http: HttpClient) {
  }

  findAllFilters(): Observable<AllFilters[]>{
    return this.http.get<AllFilters[]>(this.ALL_FILTERS_URL);
  }

}


