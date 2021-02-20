/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LabelNoteItemsComponent } from './labelNoteItems.component';
import { ActivatedRoute } from '@angular/router';
import { ContextService } from 'src/app/services/context.service';
import { LabelService } from 'src/app/services/label.service';
import { NotesService } from 'src/app/services/notes.service';
import { LabelStore } from 'src/app/stores/label.store';
import { of } from 'rxjs';

class MockNotesService {
  getNotesForLabelDefinition() {
    return of({});
  }
}

class MockLabelService {
  getLabelDefinition() {}
  saveMetaForLabelValue() {}
}

class MockContextService {
  getContextsForLabelDefinition() {
    return of({});
  }
}

class MockLabelStore {
  labelDefinitions$ = of({});
}

class MockActivatedRoute {
  queryParams = of({});
}

describe('LabelNoteItemsComponent', () => {
  let component: LabelNoteItemsComponent;
  let fixture: ComponentFixture<LabelNoteItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelNoteItemsComponent],
      providers: [
        { provide: NotesService, useClass: MockNotesService },
        { provide: LabelService, useClass: MockLabelService },
        { provide: ContextService, useClass: MockContextService },
        { provide: LabelStore, useClass: MockLabelStore },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelNoteItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
