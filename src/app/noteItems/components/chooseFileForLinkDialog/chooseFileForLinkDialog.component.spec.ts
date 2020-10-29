import { StripFileEndingPipe } from '@writerey/shared/pipes/stripFileEnding.pipe';
import { EventEmitter } from 'events';
import { MatButtonModule } from '@angular/material/button';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input, NO_ERRORS_SCHEMA, Output, Pipe, PipeTransform } from '@angular/core';

import { ChooseFileForLinkDialogComponent } from './chooseFileForLinkDialog.component';

@Component({
  selector: 'wy-document-tree',
  template: '<div>mock document tree</div>',
})
class MockDocumentTreeComponent {
  @Input() project;

  @Output() documentSelected = new EventEmitter();
}

@Pipe({ name: 'stripFileEnding' })
class MockStripFileEndingPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

class MockMatDialogRef {
  close(value?) {}
}
describe('ChooseFileForLinkDialogComponent', () => {
  let component: ChooseFileForLinkDialogComponent;
  let fixture: ComponentFixture<ChooseFileForLinkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), MatDialogModule, MatButtonModule],
      declarations: [ChooseFileForLinkDialogComponent, MockDocumentTreeComponent, MockStripFileEndingPipe],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseFileForLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
