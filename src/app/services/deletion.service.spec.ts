/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeletionService } from './deletion.service';

describe('Service: Deletion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeletionService],
    });
  });

  it('should ...', inject([DeletionService], (service: DeletionService) => {
    expect(service).toBeTruthy();
  }));
});
