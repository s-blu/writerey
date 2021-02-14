import { DirectoryService } from 'src/app/services/directory.service';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ExplorerComponent } from './explorer.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LabelService } from '../services/label.service';
import { DistractionFreeStore } from '../stores/distractionFree.store';
import { ProjectStore } from '../stores/project.store';
import { MatMenuModule } from '@angular/material/menu';
import { getTranslocoTestingModule } from '../transloco-test.module';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockMatDialog {}
class MockProjectStore {
  project$ = of({});
}
class MockDistractionFreeStore {
  distractionFree$ = of({});
}
class MockLabelService {}
class MockRouter {}

class MockDirectoryService {
  getTree() {
    return of({});
  }
}

describe('ExplorerComponent', () => {
  let component: ExplorerComponent;
  let fixture: ComponentFixture<ExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), MatMenuModule, NoopAnimationsModule],
      declarations: [ExplorerComponent],
      providers: [
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: ProjectStore, useClass: MockProjectStore },
        { provide: DistractionFreeStore, useClass: MockDistractionFreeStore },
        { provide: LabelService, useClass: MockLabelService },
        { provide: Router, useClass: MockRouter },
        { provide: DirectoryService, useClass: MockDirectoryService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
