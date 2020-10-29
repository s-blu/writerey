// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DocumentExplorerComponent } from './documentExplorer.component';
import { Router } from '@angular/router';
import { DocumentStore } from 'src/app/stores/document.store';

class MockDocumentStore {
  setFileInfo() {}
}

class MockRouter {
  navigate() {}
}

describe('DocumentExplorerComponent', () => {
  let component: DocumentExplorerComponent;
  let fixture: ComponentFixture<DocumentExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentExplorerComponent],
      providers: [
        { provide: DocumentStore, useClass: MockDocumentStore },
        { provide: Router, useClass: MockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
