import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilterBoxComponent } from './add-filter-box.component';

describe('AddFilterBoxComponent', () => {
  let component: AddFilterBoxComponent;
  let fixture: ComponentFixture<AddFilterBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFilterBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFilterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
