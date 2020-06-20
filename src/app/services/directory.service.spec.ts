// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DirectoryService } from './directory.service';

describe('Service: Directory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectoryService],
    });
  });

  it('should ...', inject([DirectoryService], (service: DirectoryService) => {
    expect(service).toBeTruthy();
  }));
});
