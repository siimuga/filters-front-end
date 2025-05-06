import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {ApiService} from '../shared/api.service';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {defineLocale, enGbLocale} from 'ngx-bootstrap/chronos';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BaseFilterComponent} from '../base-filter/base-filter.component';

defineLocale('en-gb', enGbLocale);

@Component({
  selector: 'app-add-filter',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    BsDatepickerModule,
    DatePipe
  ],
  templateUrl: './add-filter.component.html',
  styleUrl: './add-filter.component.css'
})
export class AddFilterComponent extends BaseFilterComponent  {

  @ViewChild('filterModal') filterModalRef!: ElementRef;
  @Output() sentAndCloseEvent = new EventEmitter<void>();

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

  constructor(apiService: ApiService) {
    super(apiService);
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
          this.deleteFilter();
          this.sentAndCloseEvent.emit();
          this.removeModalBackdrop();
          console.log('Request is sent and modal is closed');
      }
    );
  }

  private removeModalBackdrop(): void {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
  }
}
