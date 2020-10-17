/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { UpsertLabelValueComponent } from './upsertLabelValue.component';

describe('UpsertLabelValueComponent', () => {
  let component: UpsertLabelValueComponent;
  let fixture: ComponentFixture<UpsertLabelValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertLabelValueComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertLabelValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
