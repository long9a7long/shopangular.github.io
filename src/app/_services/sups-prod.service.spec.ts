/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SupsProdService } from './sups-prod.service';

describe('Service: SupsProd', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupsProdService]
    });
  });

  it('should ...', inject([SupsProdService], (service: SupsProdService) => {
    expect(service).toBeTruthy();
  }));
});
