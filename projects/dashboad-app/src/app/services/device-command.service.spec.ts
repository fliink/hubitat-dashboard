import { TestBed } from '@angular/core/testing';

import { DeviceCommandService } from './device-command.service';

describe('DeviceCommandService', () => {
  let service: DeviceCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
