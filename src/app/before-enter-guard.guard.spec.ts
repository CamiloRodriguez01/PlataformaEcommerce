import { TestBed } from '@angular/core/testing';

import { BeforeEnterGuardGuard } from './before-enter-guard.guard';

describe('BeforeEnterGuardGuard', () => {
  let guard: BeforeEnterGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BeforeEnterGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
