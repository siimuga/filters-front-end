import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {AllFilters} from "../all-filters/module/all-filters";
import {Type} from './type';
import {Condition} from './condition';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = "http://localhost:8080/api";
  private ALL_FILTERS_URL = `${this.BASE_URL}/filters`;
  private ALL_TYPES_URL = `${this.BASE_URL}/criteriaType`;
  private ALL_CONDITIONS_BY_TYPE_URL = `${this.BASE_URL}/comparingCondition/type`;

  constructor(private http: HttpClient) {
  }

  findAllFilters(): Observable<AllFilters[]>{
    return this.http.get<AllFilters[]>(this.ALL_FILTERS_URL);
  }

  findAllTypes() {
    return this.http.get<Type[]>(this.ALL_TYPES_URL);
  }

  findComparingConditionByType(type:string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("type",type);
    return this.http.get<Condition[]>(this.ALL_CONDITIONS_BY_TYPE_URL,{params:queryParams});
  }
}


