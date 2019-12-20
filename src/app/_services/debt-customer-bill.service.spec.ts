/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DebtCustomerBillService } from './debt-customer-bill.service';

describe('Service: DebtCustomerBill', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebtCustomerBillService]
    });
  });

  it('should ...', inject([DebtCustomerBillService], (service: DebtCustomerBillService) => {
    expect(service).toBeTruthy();
  }));
});
