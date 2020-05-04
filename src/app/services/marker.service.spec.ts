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
