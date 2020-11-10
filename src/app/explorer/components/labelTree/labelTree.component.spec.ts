// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LabelTreeComponent } from './labelTree.component';
import { of } from 'rxjs';
import { DeletionService } from 'src/app/services/deletion.service';
import { LabelService } from 'src/app/services/label.service';
import { LabelStore } from 'src/app/stores/label.store';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';

class MockLabelService {
  deleteLabelCategory() {
    return of({});
  }
}

class MockDeletionService {
  handleDeleteUserInputAndSnapshot() {
    return of({});
  }
}

class MockLabelStore {
  labelDefinitions$ = of({});
}

class MockRouter {
  navigate() {}
}

describe('LabelTreeComponent', () => {
  let component: LabelTreeComponent;
  let fixture: ComponentFixture<LabelTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), MatMenuModule, NoopAnimationsModule],
      declarations: [LabelTreeComponent],
      providers: [
        { provide: DeletionService, useClass: MockDeletionService },
        { provide: LabelService, useClass: MockLabelService },
        { provide: LabelStore, useClass: MockLabelStore },
        { provide: Router, useClass: MockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
