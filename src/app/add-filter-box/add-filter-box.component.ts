import {Component, EventEmitter, Output} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {ApiService} from '../shared/api.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {defineLocale, enGbLocale} from 'ngx-bootstrap/chronos';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BaseFilterComponent} from '../base-filter/base-filter.component';

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
export class AddFilterBoxComponent extends BaseFilterComponent {
  showFilterBox = true;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() sentAndCloseEvent = new EventEmitter<void>();

  constructor(apiService: ApiService) {
    super(apiService);
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

}
