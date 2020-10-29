import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ProjectStore } from './../../../stores/project.store';
import { DocumentService } from 'src/app/services/document.service';
import { LinkService } from 'src/app/services/link.service';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input, NO_ERRORS_SCHEMA } from '@angular/core';

import { DocumentLinkComponent } from './documentLink.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockLinkService {}
class MockDocumentService {}
class MockProjectStore {}

@Component({
  selector: 'wy-ckeditor-readonly',
  template: '<div>mock ckeditor readonly</div>',
})
class MockCkeditorReadonly {
  @Input() data;
}

@Component({
  selector: 'wy-breadcrumb',
  template: '<div> mock breadcrumb </div>',
})
class MockBreadcrumb {
  @Input() fileInfo;
  @Input() skipRoot;
}

describe('DocumentLinkComponent', () => {
  let component: DocumentLinkComponent;
  let fixture: ComponentFixture<DocumentLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule(),
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatProgressBarModule,
        MatButtonModule,
      ],
      declarations: [DocumentLinkComponent, MockCkeditorReadonly, MockBreadcrumb],
      providers: [
        { provide: LinkService, useClass: MockLinkService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ProjectStore, useClass: MockProjectStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
