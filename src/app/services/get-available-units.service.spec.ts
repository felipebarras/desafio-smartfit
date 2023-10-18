import { TestBed } from '@angular/core/testing';

import { GetAvailableUnitsService } from './get-available-units.service';

describe('GetAvailableUnitsService', () => {
  let service: GetAvailableUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAvailableUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
