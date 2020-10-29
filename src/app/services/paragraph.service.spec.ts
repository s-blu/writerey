import { HttpClientTestingModule } from '@angular/common/http/testing';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ParagraphService } from './paragraph.service';

class MockApiService {}

describe('Service: Paragraph', () => {
  let paragraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ParagraphService, { provide: ApiService, useClass: MockApiService }],
    });
    paragraphService = TestBed.inject(ParagraphService);
  });

  it('should ...', () => {
    expect(paragraphService).toBeTruthy();
  });
});
