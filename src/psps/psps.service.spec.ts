import { Test, TestingModule } from '@nestjs/testing';
import { PspsService } from './psps.service';

describe('PspsService', () => {
  let service: PspsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PspsService],
    }).compile();

    service = module.get<PspsService>(PspsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
