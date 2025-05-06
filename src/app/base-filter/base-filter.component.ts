import {Component} from '@angular/core';
import {CriteriaRequest} from '../shared/criteriarequest';
import {Condition} from '../shared/condition';
import {Type} from '../shared/type';
import {ApiService} from '../shared/api.service';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {FilterRequest} from '../shared/filterrequest';

@Component({
  selector: 'app-base-filter',
  imports: [],
  templateUrl: './base-filter.component.html',
  styleUrl: './base-filter.component.css'
})
export class BaseFilterComponent {
  model: FilterRequest = {
    name: '',
    criteriaRequests: []
  };
  criterias: CriteriaRequest[] = [];
  defaultType: string = '';
  defaultCondition: string = '';
  defaultTypes: Type[] = [];
  defaultConditions: Condition[] = [];
  isInvalidValues: boolean = false;
  showNameError: boolean = false;

  constructor(protected apiService: ApiService) {}

  protected hasValidValues(): boolean {
    const namePattern = /^[a-zA-Z0-9ÜÕÖÄüõöä]+[a-z0-9 \-üõöä]+[a-z0-9üõöä]$/;
    const isNameInvalid =     this.criterias.some(c => (c.type==='Title' && !namePattern.test(c.value.trim())));
    const hasEmptyCriteria = this.criterias.some(c => !c.value || c.value.toString().trim().length === 0);
    this.showNameError = !this.model.name || this.model.name.toString().trim().length === 0 || !namePattern.test(this.model.name.trim());
    this.isInvalidValues = isNameInvalid || hasEmptyCriteria;
    return !this.isInvalidValues;
  }

  protected showDate(criteria: CriteriaRequest) {
    return criteria.type == 'Date';
  }

  protected showAmount(criteria: CriteriaRequest) {
    return criteria.type == 'Amount';
  }

  protected showTitle(criteria: CriteriaRequest) {
    return criteria.type == 'Title';
  }

  protected setDefaultValues(type: Type[], conditions: Condition[]) {
    this.defaultType = type[0].name;
    this.defaultCondition = conditions[0].name;
    this.defaultConditions = conditions;
  }

  protected findAllTypes(): void {
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

  protected findComparingConditionByType(type: string, criteria: CriteriaRequest): void {
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

  loadInitialData(): void {
    this.findAllTypes();
  }

  onTypeChange(event: any, criteria: CriteriaRequest) {
    this.findComparingConditionByType(event.target.value, criteria);
    this.resetErrors();
  }

  resetErrors() {
    this.isInvalidValues = false;
    this.showNameError = false;
  }

  onDateChange(date: Date, criteria: CriteriaRequest) {
    if (date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      criteria.value = `${day}.${month}.${year}`;
    } else {
      criteria.value = '';
    }
    this.resetErrors();
  }

  deleteRow(criteria: CriteriaRequest) {
    const index = this.criterias.indexOf(criteria);
    if (index > -1) {
      this.criterias.splice(index, 1);
    }
    this.resetErrors();
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
    this.resetErrors();
  }

  isDisabled() {
    return this.criterias.length === 1;
  }

  isHidden(criteria: CriteriaRequest) {
    const index = this.criterias.indexOf(criteria);
    return index !== 0;
  }

  datepickerConfig = {
    dateInputFormat: 'DD.MM.YYYY',
    containerClass: 'theme-blue',
    locale: 'en-gb',
    daysOfWeekDisabled: [],
    showWeekNumbers: false
  };
}
