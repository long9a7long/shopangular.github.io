/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BillsBhService } from './bills-bh.service';

describe('Service: BillsBh', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillsBhService]
    });
  });

  it('should ...', inject([BillsBhService], (service: BillsBhService) => {
    expect(service).toBeTruthy();
  }));
});
