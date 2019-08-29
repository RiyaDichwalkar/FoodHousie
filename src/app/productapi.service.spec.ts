import { TestBed } from '@angular/core/testing';

import { ProductapiService } from './productapi.service';

describe('ProductapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductapiService = TestBed.get(ProductapiService);
    expect(service).toBeTruthy();
  });
});
