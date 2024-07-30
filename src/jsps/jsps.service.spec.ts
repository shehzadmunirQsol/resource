import { Test, TestingModule } from '@nestjs/testing';
import { JspsService } from './jsps.service';

describe('JspsService', () => {
  let service: JspsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JspsService],
    }).compile();

    service = module.get<JspsService>(JspsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
