/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CateProductService } from './cate-product.service';

describe('Service: CateProduct', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CateProductService]
    });
  });

  it('should ...', inject([CateProductService], (service: CateProductService) => {
    expect(service).toBeTruthy();
  }));
});
