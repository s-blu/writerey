/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DocumentLabelsComponent } from './documentLabels.component';

describe('DocumentMarksComponent', () => {
  let component: DocumentLabelsComponent;
  let fixture: ComponentFixture<DocumentLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentLabelsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
