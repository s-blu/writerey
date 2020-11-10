import { Observable } from 'rxjs';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { MockCkeditorComponent } from './../../../shared/test/ckeditor.component.mock';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LinkService } from 'src/app/services/link.service';
import { MatDialog } from '@angular/material/dialog';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, EventEmitter, forwardRef, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';

import { CreateNewLinkComponent } from './createNewLink.component';
import { ProjectStore } from 'src/app/stores/project.store';
import { MatOptionModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockLinkService {}

class MockProjectStore {
  project$ = new Observable();
}

class MockMatDialogRef {
  open() {}
  close() {}
}

@Component({
  selector: 'wy-breadcrumb',
  template: '<div> mock breadcrumb </div>',
})
class MockBreadcrumb {
  @Input() fileInfo;
  @Input() skipRoot;
}

describe('CreateNewLinkComponent', () => {
  let component: CreateNewLinkComponent;
  let fixture: ComponentFixture<CreateNewLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatOptionModule,
        MatIconModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: LinkService, useClass: MockLinkService },
        { provide: ProjectStore, useClass: MockProjectStore },
        { provide: MatDialog, useClass: MockMatDialogRef },
      ],
      declarations: [CreateNewLinkComponent, MockCkeditorComponent, MockBreadcrumb],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
