// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { NoteComponent } from './note.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Output } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'wy-upsert-note',
  template: '<div>create new notes item mock</div>',
})
class MockUpsertNoteComponent {
  @Input() editNote;

  @Output() noteCreated = new EventEmitter();
  @Output() editCanceled = new EventEmitter();
}

@Component({
  selector: 'wy-ckeditor-readonly',
  template: '<div>mock ckeditor readonly</div>',
})
class MockCkeditorReadonly {
  @Input() data;
}

describe('NoteComponent', () => {
  let component: NoteComponent;
  let fixture: ComponentFixture<NoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        MatTooltipModule,
        MatCardModule,
        NoopAnimationsModule,
        MatIconModule,
        MatIconModule,
      ],
      providers: [FormBuilder],
      declarations: [NoteComponent, MockUpsertNoteComponent, MockCkeditorReadonly],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
