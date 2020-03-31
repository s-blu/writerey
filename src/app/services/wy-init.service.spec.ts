/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WyInitService } from './wy-init.service';

describe('Service: WyInit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WyInitService]
    });
  });

  it('should ...', inject([WyInitService], (service: WyInitService) => {
    expect(service).toBeTruthy();
  }));
});
