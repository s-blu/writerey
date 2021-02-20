// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LabelDetailsComponent } from './labelDetails.component';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DeletionService } from 'src/app/services/deletion.service';
import { LabelService } from 'src/app/services/label.service';
import { DocumentModeStore } from 'src/app/stores/documentMode.store';
import { LabelStore } from 'src/app/stores/label.store';
import { of } from 'rxjs';

class MockLabelService {
  getLabelDefinition() {}
  updateLabelDefinition() {}
}
class MockLabelStore {
  setLabelDefinition() {}
}
class MockMatSnackBar {
  open() {}
}
class MockDeletionService {
  handleDeleteUserInputAndSnapshot() {}
}
class MockActivatedRoute {
  queryParams = of({});
}
class MockDocumentModeStore {
  setMode() {}
}

describe('LabelDetailsComponent', () => {
  let component: LabelDetailsComponent;
  let fixture: ComponentFixture<LabelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), FormsModule, ReactiveFormsModule],
      declarations: [LabelDetailsComponent],
      providers: [
        FormBuilder,
        { provide: LabelService, useClass: MockLabelService },
        { provide: LabelStore, useClass: MockLabelStore },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: DeletionService, useClass: MockDeletionService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: DocumentModeStore, useClass: MockDocumentModeStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
