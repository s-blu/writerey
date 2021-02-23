/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ParagraphNoteCounterComponent } from './paragraphNoteCounter.component';

describe('ParagraphNoteCounterComponent', () => {
  let component: ParagraphNoteCounterComponent;
  let fixture: ComponentFixture<ParagraphNoteCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParagraphNoteCounterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParagraphNoteCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
