import { TestBed, inject } from '@angular/core/testing';

import { FollowUserResolverService } from './follow-user-resolver.service';

describe('FollowUserResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FollowUserResolverService]
    });
  });

  it('should be created', inject([FollowUserResolverService], (service: FollowUserResolverService) => {
    expect(service).toBeTruthy();
  }));
});
