import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ContextStore } from '../stores/context.store';
import { LabelStore } from '../stores/label.store';
import { ProjectStore } from '../stores/project.store';
import { ApiService } from './api.service';
import { ContextService } from './context.service';
import { LabelService } from './label.service';
import { ParagraphService } from './paragraph.service';

class MockApiService {}
class MockParagraphService {}
class MockContextStore {}
class MockLabelStore {}
class MockProjectStore {}
class MockContextService {}

describe('Service: Label', () => {
  let labelService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LabelService,
        { provide: ApiService, useClass: MockApiService },
        { provide: ParagraphService, useClass: MockParagraphService },
        { provide: ContextStore, useClass: MockContextStore },
        { provide: LabelStore, useClass: MockLabelStore },
        { provide: ProjectStore, useClass: MockProjectStore },
        { provide: ContextService, useClass: MockContextService },
      ],
    });

    labelService = TestBed.inject(LabelService);
  });

  it('should ...', () => {
    expect(labelService).toBeTruthy();
  });
});
