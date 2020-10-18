/**
 * Copyright (c) 2020 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { MatIconModule } from '@angular/material/icon';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AboutDialogComponent } from './aboutDialog.component';
import packageJson from '../../../../package.json';

class MatDialogRefMock {
  open() {}
  close() {}
}

describe('AboutDialogComponent', () => {
  let component: AboutDialogComponent;
  let fixture: ComponentFixture<AboutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, getTranslocoTestingModule(), MatDividerModule, MatDialogModule],
      declarations: [AboutDialogComponent],
      providers: [{ provide: MatDialogRef, useClass: MatDialogRefMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the current project version', () => {
    const versionEl = fixture.nativeElement.querySelector('.version');

    expect(versionEl).toBeTruthy();
    expect(versionEl.textContent.trim()).toContain(packageJson.version);
  });

  it('should show the license', () => {
    const licenseEl = fixture.nativeElement.querySelector('.license');

    expect(licenseEl).toBeTruthy();
    expect(licenseEl.textContent.trim()).toContain(packageJson.license);
  });

  it('should link to the homepage', () => {
    const hompageLinkEl = fixture.nativeElement.querySelector('.homepage');

    expect(hompageLinkEl).toBeTruthy();
    expect(hompageLinkEl.href).toEqual(packageJson.homepage);
  });
});
