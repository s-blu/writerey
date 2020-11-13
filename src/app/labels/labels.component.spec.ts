/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { LabelsComponent } from './labels.component';

@Component({
  selector: 'wy-label-note-items',
  template: '<div class="mock-label-note-items">Mock Label NoteItems</div>',
})
class MockLabelNoteItemsComponent {}

@Component({
  selector: 'wy-label-details',
  template: '<div class="mock-label-details">Mock Label Details</div>',
})
class MockLabelDetailsComponent {}

describe('LabelsComponent', () => {
  let component: LabelsComponent;
  let fixture: ComponentFixture<LabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelsComponent, MockLabelDetailsComponent, MockLabelNoteItemsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain wy-label-details', () => {
    expect(fixture.nativeElement.querySelector('.mock-label-details')).toBeTruthy();
  });

  it('should contain wy-label-note-items', () => {
    expect(fixture.nativeElement.querySelector('.mock-label-note-items')).toBeTruthy();
  });
});
