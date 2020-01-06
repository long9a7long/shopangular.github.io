/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CateDetailProductService } from './cate-detail-product.service';

describe('Service: CateDetailProduct', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CateDetailProductService]
    });
  });

  it('should ...', inject([CateDetailProductService], (service: CateDetailProductService) => {
    expect(service).toBeTruthy();
  }));
});
