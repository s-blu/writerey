// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';

import { CreateNewNotesItemComponent } from './createNewNotesItem.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'wy-upsert-note',
  template: '<div>upsert note mock</div>',
})
class MockUpsertNoteComponent {
  @Input() contexts;
  @Input() contextNames;

  @Output() noteCreated = new EventEmitter();
}

@Component({
  selector: 'wy-create-new-link',
  template: '<div>create new link mock</div>',
})
class MockCreateNewLinkComponent {
  @Input() contexts;
  @Input() contextNames;

  @Output() linkCreated = new EventEmitter();
}

describe('CreateNewNoteOrLinkComponent', () => {
  let component: CreateNewNotesItemComponent;
  let fixture: ComponentFixture<CreateNewNotesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        NoopAnimationsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatOptionModule,
      ],
      declarations: [CreateNewNotesItemComponent, MockUpsertNoteComponent, MockCreateNewLinkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewNotesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
