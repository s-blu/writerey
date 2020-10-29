// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LabelStore } from '../stores/label.store';
import { ContextService } from './context.service';
import { ParagraphService } from './paragraph.service';

class MockParagraphService {
  getParagraphMeta() {
    return of({});
  }
}
class MockLabelStore {
  labelDefinitions$ = of({});
}

describe('Service: Context', () => {
  let contextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContextService,
        { provide: ParagraphService, useClass: MockParagraphService },
        { provide: LabelStore, useClass: MockLabelStore },
      ],
    });
    contextService = TestBed.inject(ContextService);
  });

  it('should ...', () => {
    expect(contextService).toBeTruthy();
  });
});
