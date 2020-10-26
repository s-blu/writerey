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
import { FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UpsertNoteComponent } from './upsertNote.component';
import { MatIconModule } from '@angular/material/icon';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ckeditor',
  template: '<div>mock ckeditor</div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockCkeditorComponent),
      multi: true,
    },
  ],
})
class MockCkeditorComponent implements ControlValueAccessor {
  @Input() editor;
  @Input() config;
  @Output() ready = new EventEmitter();
  // tslint:disable-next-line: no-output-native
  @Output() change = new EventEmitter();

  /**
   * MockComponent needs to implement ControlValueAccessor interface if used in a formBuilder
   * meaning if given a [formControl] or [(ngModel)] binding
   */
  @Input() disabled = false;

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
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
