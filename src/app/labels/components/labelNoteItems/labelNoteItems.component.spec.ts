/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LabelNoteItemsComponent } from './labelNoteItems.component';

describe('LabelNoteItemsComponent', () => {
  let component: LabelNoteItemsComponent;
  let fixture: ComponentFixture<LabelNoteItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelNoteItemsComponent],
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
