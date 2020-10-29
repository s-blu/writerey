// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { LabelService } from './label.service';
import { NotesService } from './notes.service';
import { ParagraphService } from './paragraph.service';

class MockLabelService {}
class MockParagraphService {}
class MockApiService {}

describe('Service: Notes', () => {
  let notesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotesService,
        { provide: ParagraphService, useClass: MockParagraphService },
        { provide: ApiService, useClass: MockApiService },
        { provide: LabelService, useClass: MockLabelService },
      ],
    });

    notesService = TestBed.inject(NotesService);
  });

  it('should ...', () => {
    expect(notesService).toBeTruthy();
  });
});
