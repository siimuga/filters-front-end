import {Component, EventEmitter, Output} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {ApiService} from '../shared/api.service';
import {FilterRequest} from '../shared/filterrequest';
import {CriteriaRequest} from '../shared/criteriarequest';
import {Type} from '../shared/type';
import {Condition} from '../shared/condition';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {defineLocale, enGbLocale} from 'ngx-bootstrap/chronos';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';

defineLocale('en-gb', enGbLocale);

@Component({
  selector: 'app-add-filter-box',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    DatePipe,
    BsDatepickerModule
  ],
  templateUrl: './add-filter-box.component.html',
  styleUrl: './add-filter-box.component.css'
})
export class AddFilterBoxComponent {
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
  showFilterBox = true;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() sentAndCloseEvent = new EventEmitter<void>();

  constructor(private apiService: ApiService) {
  }

  closeBox() {
    this.showFilterBox = false;
    this.deleteFilter();
    this.closeEvent.emit();
    console.log('Box is closed');
  }

  sentAndCloseBox() {
    this.showFilterBox = false;
    this.deleteFilter();
    this.sentAndCloseEvent.emit();
    console.log('Request is sent and box is closed');
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
    this.resetErrors();
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
        this.sentAndCloseBox();
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
    this.resetErrors();
  }

  deleteRow(criteria: CriteriaRequest) {
    const index = this.criterias.indexOf(criteria);
    if (index > -1) {
      this.criterias.splice(index, 1);
    }
    this.resetErrors();
  }

  isDisabled() {
    return this.criterias.length === 1;
  }

  isHidden(criteria: CriteriaRequest) {
    const index = this.criterias.indexOf(criteria);
    return index !== 0;
  }

  hasValidValues(): boolean {
    const namePattern = /^[a-zA-Z0-9ÜÕÖÄüõöä]+[a-z0-9 \-üõöä]+[a-z0-9üõöä]$/;
    const isNameInvalid =     this.criterias.some(c => (c.type==='Title' && !namePattern.test(c.value.trim())));
    const hasEmptyCriteria = this.criterias.some(c => !c.value || c.value.toString().trim().length === 0);
    this.showNameError = !this.model.name || this.model.name.toString().trim().length === 0 || !namePattern.test(this.model.name.trim());
    this.isInvalidValues = isNameInvalid || hasEmptyCriteria;
    return !this.isInvalidValues;
  }

  resetErrors() {
    this.isInvalidValues = false;
    this.showNameError = false;
  }

  datepickerConfig = {
    dateInputFormat: 'DD.MM.YYYY',
    containerClass: 'theme-blue',
    locale: 'en-gb',
    daysOfWeekDisabled: [],
    showWeekNumbers: false
  };

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

}
