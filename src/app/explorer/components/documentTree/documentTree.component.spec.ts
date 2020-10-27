// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DocumentTreeComponent } from './documentTree.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { DeletionService } from 'src/app/services/deletion.service';
import { StripFileEndingPipe } from '@writerey/shared/pipes/stripFileEnding.pipe';
import { DirectoryService } from 'src/app/services/directory.service';
import { DocumentService } from 'src/app/services/document.service';
import { DirectoryStore } from 'src/app/stores/directory.store';
import { DocumentStore } from 'src/app/stores/document.store';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';

class MockDirectoryStore {
  tree$ = of({});
  transform() {}
}
class MockDocumentStore {
  fileInfo$ = of({});
}
class MockDocumentService {
  getStartPage() {}
  setStartPage() {}
  removeStartPage() {}
  moveDocument() {}
  deleteDocument() {}
}
class MockDirectoryService {
  getTree() {}
  moveDirectory() {}
}

class MockDeletionService {
  handleDeleteUserInputAndSnapshot() {
    return of({});
  }
}

describe('DocumentTreeComponent', () => {
  let component: DocumentTreeComponent;
  let fixture: ComponentFixture<DocumentTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), MatDialogModule, MatSnackBarModule, MatMenuModule, MatTreeModule],
      declarations: [DocumentTreeComponent, StripFileEndingPipe],
      providers: [
        { provide: DirectoryStore, useClass: MockDirectoryStore },
        { provide: DocumentStore, useClass: MockDocumentStore },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: DirectoryService, useClass: MockDirectoryService },
        StripFileEndingPipe,
        { provide: DeletionService, useClass: MockDeletionService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
