// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProjectsComponent } from './projects.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DeletionService } from 'src/app/services/deletion.service';
import { DirectoryStore } from 'src/app/stores/directory.store';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockDirectoryStore {
  createDirectory() {
    return of({});
  }

  deleteDirectory() {}

  getTree() {
    return of({});
  }

  renameProject() {}
}

class MockDeletionService {
  handleDeleteUserInputAndSnapshot() {
    return of({});
  }
}

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        MatDialogModule,
        MatSnackBarModule,
        MatMenuModule,
        HttpClientTestingModule,
      ],
      declarations: [ProjectsComponent],
      providers: [
        { provide: DirectoryStore, useClass: MockDirectoryStore },
        { provide: DeletionService, useClass: MockDeletionService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
