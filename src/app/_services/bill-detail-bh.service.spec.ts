/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BillDetailBhService } from './bill-detail-bh.service';

describe('Service: BillDetailBh', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillDetailBhService]
    });
  });

  it('should ...', inject([BillDetailBhService], (service: BillDetailBhService) => {
    expect(service).toBeTruthy();
  }));
});
