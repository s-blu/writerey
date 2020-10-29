// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTranslocoTestingModule } from '../transloco-test.module';
import { SnapshotService } from './snapshot.service';
import { SnapshotStore } from '../stores/snapshot.store';
import { ApiService } from './api.service';

class MockApiService {}
class MockSnapshotStore {}
describe('Service: Snapshot', () => {
  let snapshotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, getTranslocoTestingModule()],
      providers: [
        SnapshotService,
        { provide: ApiService, useClass: MockApiService },
        { provide: SnapshotStore, useClass: MockSnapshotStore },
      ],
    });

    snapshotService = TestBed.inject(SnapshotService);
  });

  it('should ...', () => {
    expect(snapshotService).toBeTruthy();
  });
});
