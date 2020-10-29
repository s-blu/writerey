import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

import { NameSnapshotDialogComponent } from './nameSnapshotDialog.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockMatDialogRef {
  close() {}
}

describe('NameSnapshotDialogComponent', () => {
  let component: NameSnapshotDialogComponent;
  let fixture: ComponentFixture<NameSnapshotDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        MatDialogModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      declarations: [NameSnapshotDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameSnapshotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
