import { Test, TestingModule } from '@nestjs/testing';
import { PspsController } from './psps.controller';
import { PspsService } from './psps.service';

describe('PspsController', () => {
  let controller: PspsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PspsController],
      providers: [PspsService],
    }).compile();

    controller = module.get<PspsController>(PspsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
