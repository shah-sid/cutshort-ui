import { TestBed, inject } from '@angular/core/testing';

import { UserOrgService } from './user-org.service';

describe('UserOrgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserOrgService]
    });
  });

  it('should be created', inject([UserOrgService], (service: UserOrgService) => {
    expect(service).toBeTruthy();
  }));
});
