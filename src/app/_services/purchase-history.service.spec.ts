/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PurchaseHistoryService } from './purchase-history.service';

describe('Service: CustomersBill', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchaseHistoryService]
    });
  });

  it('should ...', inject([PurchaseHistoryService], (service: PurchaseHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
