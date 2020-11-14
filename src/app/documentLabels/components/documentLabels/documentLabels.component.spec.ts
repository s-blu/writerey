// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DocumentLabelsComponent } from './documentLabels.component';
import { ContextService } from 'src/app/services/context.service';
import { LabelService } from 'src/app/services/label.service';
import { ParagraphService } from 'src/app/services/paragraph.service';
import { DistractionFreeStore } from 'src/app/stores/distractionFree.store';
import { DocumentStore } from 'src/app/stores/document.store';
import { DocumentModeStore } from 'src/app/stores/documentMode.store';
import { LabelStore } from 'src/app/stores/label.store';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { AddClassesForDistractionStatesDirective } from '@writerey/shared/directives/addClassesForDistractionStates.directive';
import { of } from 'rxjs';

class MockParagraphService {}
class MockLabelService {}
class MockLabelStore {
  labelDefinitions$ = of({});
}
class MockDocumentModeStore {
  mode$ = of({});
}
class MockDocumentStore {
  paragraphId$ = of({});
  fileInfo$ = of({});
}
class MockDistractionFreeStore {
  distractionFree$ = of({});
}
class MockContextService {}

describe('DocumentMarksComponent', () => {
  let component: DocumentLabelsComponent;
  let fixture: ComponentFixture<DocumentLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      declarations: [DocumentLabelsComponent],
      providers: [
        { provide: ParagraphService, useClass: MockParagraphService },
        { provide: LabelService, useClass: MockLabelService },
        { provide: LabelStore, useClass: MockLabelStore },
        { provide: DocumentModeStore, useClass: MockDocumentModeStore },
        { provide: DocumentStore, useClass: MockDocumentStore },
        { provide: DistractionFreeStore, useClass: MockDistractionFreeStore },
        { provide: ContextService, useClass: MockContextService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
