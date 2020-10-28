// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, forwardRef, ViewChild } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertNoteComponent } from './upsertNote.component';
import { MatIconModule } from '@angular/material/icon';
import { ControlValueAccessor } from '@angular/forms';
import { NOTE_DRAFT_KEY } from './upsertNote.component';
import { MockCkeditorComponent } from '@writerey/shared/test/ckeditor.component.mock';

const EMPTY_TEXT = ' \n';

class MockLocalStore {
  getItem(key: string) {}
  setItem(key: string, value: string) {}
  removeItem(key: string) {}
  clear() {}
}

describe('CreateNewNoteComponent', () => {
  let component: UpsertNoteComponent;
  let fixture: ComponentFixture<UpsertNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        getTranslocoTestingModule(),
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [FormBuilder],
      declarations: [UpsertNoteComponent, MockCkeditorComponent],
    }).compileComponents();

    // This needs to be overwritten to be able to spy on it for some reason
    Object.defineProperty(window, 'localStorage', {
      value: new MockLocalStore(),
    });
  }));

  function createComponentForTest() {
    fixture = TestBed.createComponent(UpsertNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('upsertNote', () => {
    beforeEach(() => {
      createComponentForTest();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Draft', () => {
    it('should start with an empty input if no draft is available', () => {
      createComponentForTest();
      expect(component.createNewForm.controls.text.value).toEqual(EMPTY_TEXT);
    });

    it('should load the "new" draft if draft is available and no editNote is given', () => {
      const draft = 'this is a test draft';

      spyOn(localStorage, 'getItem').and.callFake(key => {
        if (key === NOTE_DRAFT_KEY + 'new') return draft;
        return null;
      });

      createComponentForTest();
      expect(component.createNewForm.controls.text.value).toEqual(draft);
    });

    it('should show a "Draft" hint in html if and only if a draft is loaded', () => {
      const draft = 'this is a test draft';

      createComponentForTest();
      expect(fixture.nativeElement.querySelector('.draft-hint')).toBeFalsy();

      spyOn(localStorage, 'getItem').and.callFake(key => {
        if (key === NOTE_DRAFT_KEY + 'new') return draft;
        return null;
      });

      fixture.componentInstance.ngOnInit();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.draft-hint')).toBeTruthy();
    });

    it('should load the note specific draft if a note gets edited', () => {
      const draft = 'this is a note specific draft';
      spyOn(localStorage, 'getItem').and.callFake(key => {
        if (key === NOTE_DRAFT_KEY + 'mock-note') return draft;
        return null;
      });

      createComponentForTest();
      component.editNote = { id: 'mock-note' };
      fixture.componentInstance.ngOnInit();

      expect(component.createNewForm.controls.text.value).toEqual(draft);
    });

    it('should save input text as a draft to local Storage', done => {
      const draft = 'please save me as draft';
      const draftHtml = `<p>${draft}</p>`;

      const setItemSpy = spyOn(localStorage, 'setItem');

      createComponentForTest();
      component.editorChanged({
        editor: {
          sourceElement: {
            innerText: draft,
          },
          getData: () => draftHtml,
        },
      });
      setTimeout(() => {
        expect(setItemSpy).toHaveBeenCalledWith(NOTE_DRAFT_KEY + 'new', draftHtml);
        done();
      }, 650); // need to wait until debounceTime(600) triggered
    });

    it('should not save an input with only white characters as draft', done => {
      const draft = '    \n  \t';
      const draftHtml = `<p>${draft}</p>`;
      const setItemSpy = spyOn(localStorage, 'setItem');
      createComponentForTest();

      component.editorChanged({
        editor: {
          sourceElement: {
            innerText: draft,
          },
          getData: () => draftHtml,
        },
      });
      setTimeout(() => {
        expect(setItemSpy).not.toHaveBeenCalled();
        done();
      }, 650); // need to wait until debounceTime(600) triggered
    });

    it('should remove the draft if editing is canceled', () => {
      const removeItemSpy = spyOn(localStorage, 'removeItem');
      createComponentForTest();

      component.cancelEdit();
      expect(removeItemSpy).toHaveBeenCalled();
    });
  });
});
