/**
 * Copyright (c) 2021 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NoteItemColorChooserComponent } from './noteItemColorChooser.component';

describe('NoteItemColorChooserComponent', () => {
  let component: NoteItemColorChooserComponent;
  let fixture: ComponentFixture<NoteItemColorChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteItemColorChooserComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteItemColorChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
