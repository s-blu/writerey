/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { LabelNoteItemsComponent } from './labelNoteItems.component';

xdescribe('LabelNoteItemsComponent', () => {
  let component: LabelNoteItemsComponent;
  let fixture: ComponentFixture<LabelNoteItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelNoteItemsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelNoteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
