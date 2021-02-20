/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { DocumentsComponent } from './documents.component';

@Component({
  selector: 'wy-document-labels',
  template: '<div class="mock-document-labels">Mock Document Labels</div>',
})
class MockDocumentLabelsComponent {}

@Component({
  selector: 'wy-document-editor',
  template: '<div class="mock-document-editor">Mock document editor</div>',
})
class MockDocumentEditorComponent {}

@Component({
  selector: 'wy-document-note-items',
  template: '<div class="mock-document-note-items">Mock document note items</div>',
})
class MockDocumentNoteItemsComponent {}

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentsComponent,
        MockDocumentLabelsComponent,
        MockDocumentEditorComponent,
        MockDocumentNoteItemsComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain wy-document-editor', () => {
    expect(fixture.nativeElement.querySelector('wy-document-editor')).toBeTruthy();
  });

  it('should contain wy-document-labels', () => {
    expect(fixture.nativeElement.querySelector('wy-document-labels')).toBeTruthy();
  });

  it('should contain wy-document-note-items', () => {
    expect(fixture.nativeElement.querySelector('wy-document-note-items')).toBeTruthy();
  });
});
