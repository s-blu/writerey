/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { DocumentsTopbarComponent } from './documentsTopbar.component';

@Component({
  selector: 'wy-ckeditor-toolbar',
  template: '<div class="mock-ckeditor-toolbar">Mock ckeditor-toolbar</div>',
})
class MockCkeditorToolbarComponent {}

describe('DocumentsTopbarComponent', () => {
  let component: DocumentsTopbarComponent;
  let fixture: ComponentFixture<DocumentsTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsTopbarComponent, MockCkeditorToolbarComponent],
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

  it('should contain editor toolbar', () => {
    expect(fixture.nativeElement.querySelector('wy-ckeditor-toolbar')).toBeTruthy();
  });
});
