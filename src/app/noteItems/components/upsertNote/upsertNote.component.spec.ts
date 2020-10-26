// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UpsertNoteComponent } from './upsertNote.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ckeditor',
  template: '<div>mock ckeditor</div>',
})
class MockCkeditorComponent {
  @Input() editor;
  @Input() config;
  @Output() ready = new EventEmitter();
  // tslint:disable-next-line: no-output-native
  @Output() change = new EventEmitter();
}

describe('CreateNewNoteComponent', () => {
  let component: UpsertNoteComponent;
  let fixture: ComponentFixture<UpsertNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        getTranslocoTestingModule(),
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [FormBuilder],
      declarations: [UpsertNoteComponent, MockCkeditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
