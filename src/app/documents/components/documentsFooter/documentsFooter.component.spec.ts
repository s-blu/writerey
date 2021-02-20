/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { DocumentsFooterComponent } from './documentsFooter.component';

@Component({
  selector: 'wy-mode-switcher',
  template: '<div class="mock-mode-switcher">Mock Mode Switcher</div>',
})
class MockModeSwitcherComponent {}

@Component({
  selector: 'wy-word-count',
  template: '<div class="mock-word-count">Mock Word Count</div>',
})
class MockWordCountComponent {}

@Component({
  selector: 'wy-last-modified',
  template: '<div class="mock-last-modified">Mock Last Modified</div>',
})
class MockLastModifiedComponent {}

describe('DocumentsFooterComponent', () => {
  let component: DocumentsFooterComponent;
  let fixture: ComponentFixture<DocumentsFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentsFooterComponent,
        MockWordCountComponent,
        MockModeSwitcherComponent,
        MockLastModifiedComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain mode switcher, word count and last modified components', () => {
    expect(fixture.nativeElement.querySelector('wy-mode-switcher')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('wy-word-count')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('wy-last-modified')).toBeTruthy();
  });
});
