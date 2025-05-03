import {Component, ElementRef, ViewChild} from '@angular/core';
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
export class AddFilterComponent  {
  model: FilterRequest = {
    name: '',
    criteriaRequests: []
  };
  criterias: CriteriaRequest[] = [];
  defaultType: string = '';
  defaultCondition: string = '';
  defaultTypes: Type[] = [];
  defaultConditions: Condition[] = [];

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

  constructor(private apiService: ApiService) {
  }

  loadInitialData(): void {
    this.findAllTypes();
  }

  private findAllTypes(): void {
    this.apiService.findAllTypes().pipe(
      catchError((err) => {
        console.error('Failed to load types', err);
        return of([]);
      })
    ).subscribe((res) => {

      if (res.length > 0) {
        this.defaultTypes = res;
        this.findComparingConditionByTypeAndInitCriteria(res);
      }
    });
  }

  private findComparingConditionByTypeAndInitCriteria(types: Type[]): void {
    this.apiService.findComparingConditionByType(types[0].name).pipe(
      catchError(err => {
        console.error('Failed to load comparing conditions', err);
        alert("An error occurred");
        return of([]);
      })
    ).subscribe((res) => {

      if (res.length > 0) {
        this.initCriteria(types, res);
      }
    });
  }

  private findComparingConditionByType(type: string, criteria: CriteriaRequest): void {
    this.apiService.findComparingConditionByType(type).pipe(
      catchError(err => {
        console.error('Failed to load comparing conditions', err);
        alert("An error occurred");
        return of([]);
      })
    ).subscribe((res) => {
      criteria.conditions = res;
      criteria.condition = criteria.conditions[0].name
      criteria.value = '';
    });
  }

  onTypeChange(event: any, criteria: CriteriaRequest) {
    this.findComparingConditionByType(event.target.value, criteria);
  }

  private initCriteria(types: Type[], conditions: Condition[]): void {
    const newCriteria: CriteriaRequest = {
      type: types[0].name,
      condition: conditions[0].name,
      value: '',
      conditions: conditions.map(cond => ({ ...cond })),
      types: types.map(type => ({ ...type }))
    };
    this.criterias.push(newCriteria);
    this.setDefaultValues(types, conditions);
  }

  private setDefaultValues(type: Type[], conditions: Condition[]) {
    this.defaultType = type[0].name;
    this.defaultCondition = conditions[0].name;
    this.defaultConditions = conditions;
  }

  sendRequest(): void {
    this.model.criteriaRequests = this.criterias;
    this.apiService.sendRequest(this.model).pipe(
      catchError((err) => {
        console.error('Filter adding failed', err);
        return of([]);
      })
    ).subscribe(
      () => {
      }
    );
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
      value: '',
      conditions: this.defaultConditions.map(cond => ({ ...cond })),
      types: this.defaultTypes.map(type => ({ ...type }))
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
