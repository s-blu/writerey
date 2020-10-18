// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { CreateNewDirOrFileComponent } from './createNewDirOrFile.component';

describe('CreateNewDirOrFileComponent', () => {
  let component: CreateNewDirOrFileComponent;
  let fixture: ComponentFixture<CreateNewDirOrFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewDirOrFileComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewDirOrFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
