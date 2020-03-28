/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ParagraphService } from './paragraph.service';

describe('Service: Paragraph', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParagraphService],
    });
  });

  it('should ...', inject([ParagraphService], (service: ParagraphService) => {
    expect(service).toBeTruthy();
  }));
});
