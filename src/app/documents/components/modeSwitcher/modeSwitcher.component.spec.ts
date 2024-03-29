// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { ModeSwitcherComponent } from './modeSwitcher.component';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { DocumentStore } from 'src/app/stores/document.store';
import { DocumentModeStore } from 'src/app/stores/documentMode.store';

describe('ModeSwitcherComponent', () => {
  let component: ModeSwitcherComponent;
  let fixture: ComponentFixture<ModeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModeSwitcherComponent],
      imports: [getTranslocoTestingModule()],
      providers: [DocumentModeStore, DocumentStore],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
