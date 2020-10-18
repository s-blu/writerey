/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { DocumentNoteItemsComponent } from './documentNoteItems.component';

xdescribe('DocumentNoteItemsComponent', () => {
  let component: DocumentNoteItemsComponent;
  let fixture: ComponentFixture<DocumentNoteItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentNoteItemsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentNoteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
