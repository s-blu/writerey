import { HttpClientTestingModule } from '@angular/common/http/testing';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { LinkService } from './link.service';

class MockApiService {}

describe('Service: Link', () => {
  let linkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LinkService, { provide: ApiService, useClass: MockApiService }],
    });

    linkService = TestBed.inject(LinkService);
  });

  it('should ...', () => {
    expect(linkService).toBeTruthy();
  });
});
