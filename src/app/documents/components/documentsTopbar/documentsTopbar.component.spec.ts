/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DocumentsTopbarComponent } from './documentsTopbar.component';

describe('DocumentsTopbarComponent', () => {
  let component: DocumentsTopbarComponent;
  let fixture: ComponentFixture<DocumentsTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsTopbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
