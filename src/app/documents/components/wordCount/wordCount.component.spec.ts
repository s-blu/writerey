import { DocumentStore } from 'src/app/stores/document.store';
import { Observable } from 'rxjs';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { WordCountComponent } from './wordCount.component';

class MockDocumentStore {
  wordCount$ = new Observable();
}

describe('WordCountComponent', () => {
  let component: WordCountComponent;
  let fixture: ComponentFixture<WordCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      declarations: [WordCountComponent],
      providers: [{ provide: DocumentStore, useClass: MockDocumentStore }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
