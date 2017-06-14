import { TestBed, inject } from '@angular/core/testing';

import { InfiniteScrollService } from './infinite-scroll.service';

describe('InfiniteScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfiniteScrollService]
    });
  });

  it('should be created', inject([InfiniteScrollService], (service: InfiniteScrollService) => {
    expect(service).toBeTruthy();
  }));
});
