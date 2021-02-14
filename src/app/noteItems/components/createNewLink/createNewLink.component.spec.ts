// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Component, Input } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { LinkService } from 'src/app/services/link.service';
import { ProjectStore } from 'src/app/stores/project.store';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { MockCkeditorComponent } from './../../../shared/test/ckeditor.component.mock';
import { CreateNewLinkComponent } from './createNewLink.component';

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
class MockBreadcrumbComponent {
  @Input() fileInfo;
  @Input() skipRoot;
}

@Component({
  selector: 'wy-note-item-color-chooser',
  template: '<div class="mock-component"></div>',
})
class MockNoteItemColorChooserComponent {
  @Input() initialColor;
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
      declarations: [
        CreateNewLinkComponent,
        MockCkeditorComponent,
        MockBreadcrumbComponent,
        MockNoteItemColorChooserComponent,
      ],
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
