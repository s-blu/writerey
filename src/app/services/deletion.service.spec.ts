// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { getTranslocoTestingModule } from '../transloco-test.module';
import { DeletionService } from './deletion.service';
import { SnapshotService } from './snapshot.service';

class MockMatDialog {}
class MockSnapshotService {}

describe('Service: Deletion', () => {
  let deletionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        DeletionService,
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: SnapshotService, useClass: MockSnapshotService },
      ],
    });

    deletionService = TestBed.inject(DeletionService);
  });

  it('should ...', () => {
    expect(deletionService).toBeTruthy();
  });
});
