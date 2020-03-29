/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SnapshotService } from './snapshot.service';

describe('Service: Snapshot', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnapshotService]
    });
  });

  it('should ...', inject([SnapshotService], (service: SnapshotService) => {
    expect(service).toBeTruthy();
  }));
});
