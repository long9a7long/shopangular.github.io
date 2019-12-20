/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManufProdService } from './manuf-prod.service';

describe('Service: ManufProd', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManufProdService]
    });
  });

  it('should ...', inject([ManufProdService], (service: ManufProdService) => {
    expect(service).toBeTruthy();
  }));
});
