// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CreateNewItemDialogComponent } from './createNewItemDialog.component';

class MockDialogRef {
  close() {}
}

describe('CreateNewFileDialogComponent', () => {
  let component: CreateNewItemDialogComponent;
  let fixture: ComponentFixture<CreateNewItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        NoopAnimationsModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
      ],
      declarations: [CreateNewItemDialogComponent],
      providers: [
        { provide: MatDialogRef, useClass: MockDialogRef },
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
