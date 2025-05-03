import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../shared/api.service';
import {FilterRequest} from '../shared/filterrequest';
import {Type} from '../shared/type';
import {Condition} from '../shared/condition';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {NgForOf, NgIf} from '@angular/common';
import {CriteriaRequest} from '../shared/criteriarequest';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-filter',
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './add-filter.component.html',
  styleUrl: './add-filter.component.css'
})
export class AddFilterComponent implements OnInit  {
  model: FilterRequest = {
    name: '',
    criteriaRequests: []
  };
  types: Type[] = [];
  conditions: Condition[] = [];
  criterias: CriteriaRequest[] = [];
  defaultType: string = '';
  defaultCondition: string = '';

  @ViewChild('filterModal') filterModalRef!: ElementRef;

  ngAfterViewInit() {
    const modalEl = this.filterModalRef.nativeElement;

    modalEl.addEventListener('hidden.bs.modal', () => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.deleteFilter();
    console.log('Modal is closed');
  }

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

  onTypeChange(event: any, criteria: CriteriaRequest) {
    this.findComparingConditionByType(event.target.value);
    criteria.value = '';
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

  sendRequest(): void {
  }

  showAmount(criteria: CriteriaRequest) {
    return criteria.type == 'Amount';
  }

  showTitle(criteria: CriteriaRequest) {
    return criteria.type == 'Title';
  }

  showDate(criteria: CriteriaRequest) {
    return criteria.type == 'Date';
  }

  deleteFilter() {
    this.criterias = [];
    this.model.name = '';
  }

  addRow() {
    const newCriteria: CriteriaRequest = {
      type: this.defaultType,
      condition: this.defaultCondition,
      value: ''
    };
    this.criterias.push(newCriteria);
  }

  deleteRow(criteria: CriteriaRequest) {
    const index = this.criterias.indexOf(criteria);
    if (index > -1) {
      this.criterias.splice(index, 1);
    }
  }

  isDisabled() {
    return this.criterias.length === 1;
  }

  isHidden(criteria: CriteriaRequest) {
    const index = this.criterias.indexOf(criteria);
    return index !== 0;
  }
}
