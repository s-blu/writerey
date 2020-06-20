// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LabelService } from './label.service';

describe('Service: Label', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LabelService],
    });
  });

  it('should ...', inject([LabelService], (service: LabelService) => {
    expect(service).toBeTruthy();
  }));
});
