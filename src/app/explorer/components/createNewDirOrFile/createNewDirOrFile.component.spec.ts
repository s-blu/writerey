// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CreateNewDirOrFileComponent } from './createNewDirOrFile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StripFileEndingPipe } from '@writerey/shared/pipes/stripFileEnding.pipe';
import { DirectoryService } from 'src/app/services/directory.service';
import { DocumentService } from 'src/app/services/document.service';
import { DirectoryStore } from 'src/app/stores/directory.store';
import { DocumentStore } from 'src/app/stores/document.store';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { of } from 'rxjs';

class MockDocumentService {
  createDocument() {}
}

class MockDocumentStore {
  setFileInfo() {}
}

class MockDirectoryService {
  createDirectory() {}
  getTree() {
    return of({});
  }
}

class MockDirectoryStore {
  tree$ = of({});
}

describe('CreateNewDirOrFileComponent', () => {
  let component: CreateNewDirOrFileComponent;
  let fixture: ComponentFixture<CreateNewDirOrFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), MatDialogModule, MatSnackBarModule],
      declarations: [CreateNewDirOrFileComponent, StripFileEndingPipe],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: DocumentStore, useClass: MockDocumentStore },
        { provide: DirectoryService, useClass: MockDirectoryService },
        { provide: DirectoryStore, useClass: MockDirectoryStore },
        StripFileEndingPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewDirOrFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
