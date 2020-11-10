// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { LabelStore } from 'src/app/stores/label.store';
import { DistractionFreeStore } from 'src/app/stores/distractionFree.store';
import { DocumentModeStore } from 'src/app/stores/documentMode.store';
import { EventEmitter } from 'events';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NoteItemsComponent } from './noteItems.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'wy-notes-item',
  template: '<div>notes item mock</div>',
})
class MockNotesItemComponent {
  @Input() item;
  @Input() labelDefs;

  @Output() deleteItem = new EventEmitter();
  @Output() editItem = new EventEmitter();
}

@Component({
  selector: 'wy-create-new-notes-item',
  template: '<div>create new notes item mock</div>',
})
class MockCreateNewNotesItemComponent {
  @Input() contexts;
  @Input() labelDefs;

  @Output() itemCreated = new EventEmitter();
}

class MockDocumentModeStore {
  mode$ = new Observable();
}
class MockDistractionFreeStore {
  distractionFree$ = new Observable();
}
class MockLabelStore {
  labelDefinitions$ = new Observable();
}

describe('NotesComponent', () => {
  let component: NoteItemsComponent;
  let fixture: ComponentFixture<NoteItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatTooltipModule, MatIconModule, MatExpansionModule, getTranslocoTestingModule()],
      providers: [
        { provide: DocumentModeStore, useClass: MockDocumentModeStore },
        { provide: DistractionFreeStore, useClass: MockDistractionFreeStore },
        { provide: LabelStore, useClass: MockLabelStore },
      ],
      declarations: [NoteItemsComponent, MockCreateNewNotesItemComponent, MockNotesItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
