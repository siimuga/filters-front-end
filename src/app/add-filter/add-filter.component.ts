import {Component, OnInit} from '@angular/core';
import {ApiService} from '../shared/api.service';
import {FilterRequest} from '../shared/filterrequest';
import {Type} from '../shared/type';
import {Condition} from '../shared/condition';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {NgForOf} from '@angular/common';
import {CriteriaRequest} from '../shared/criteriarequest';

@Component({
  selector: 'app-add-filter',
  imports: [
    NgForOf
  ],
  templateUrl: './add-filter.component.html',
  styleUrl: './add-filter.component.css'
})
export class AddFilterComponent implements OnInit {
  model: FilterRequest = {
    name: '',
    criteriaRequests: []
  };
  types: Type[] = [];
  conditions: Condition[] = [];
  criterias: CriteriaRequest[] = [];
  defaultType: string = '';
  defaultCondition: string = '';

  ngOnInit() {
    this.loadInitialData();
  }

  constructor(private apiService: ApiService) {
  }

  private loadInitialData(): void {
    this.findAllTypes();
  }

  private findAllTypes(): void {
    this.apiService.findAllTypes().pipe(
      catchError((err) => {
        console.error('Failed to load types', err);
        return of([]);
      })
    ).subscribe((res) => {
      this.types = res;

      if (this.types.length > 0) {
        this.findComparingConditionByTypeAndInitCriteria(this.types[0].name);
      }
    });
  }

  private findComparingConditionByTypeAndInitCriteria(type: string): void {
    this.apiService.findComparingConditionByType(type).pipe(
      catchError(err => {
        console.error('Failed to load comparing conditions', err);
        alert("An error occurred");
        return of([]);
      })
    ).subscribe((res) => {
      this.conditions = res;

      if (this.conditions.length > 0) {
        this.initCriteria(type, this.conditions[0].name);
      }
    });
  }

  private findComparingConditionByType(type: string): void {
    this.apiService.findComparingConditionByType(type).pipe(
      catchError(err => {
        console.error('Failed to load comparing conditions', err);
        alert("An error occurred");
        return of([]);
      })
    ).subscribe((res) => {
      this.conditions = res;
    });
  }

  onTypeChange(event: any) {
    this.findComparingConditionByType(event.target.value);
  }

  private initCriteria(type: string, condition:string): void {
    const newCriteria: CriteriaRequest = {
      type: type,
      condition: condition,
      value: ''
    };
    this.criterias.push(newCriteria);
    this.setDefaultValues(type, condition);
  }

  private setDefaultValues(type: string, condition: string) {
    this.defaultType = type;
    this.defaultCondition = condition;
  }
}
