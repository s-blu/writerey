/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MetaDatabaseService } from './meta-database.service';

describe('Service: MetaDatabase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetaDatabaseService],
    });
  });

  it('should ...', inject([MetaDatabaseService], (service: MetaDatabaseService) => {
    expect(service).toBeTruthy();
  }));
});
