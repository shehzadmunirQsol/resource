import { Test, TestingModule } from '@nestjs/testing';
import { JspsController } from './jsps.controller';
import { JspsService } from './jsps.service';

describe('JspsController', () => {
  let controller: JspsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JspsController],
      providers: [JspsService],
    }).compile();

    controller = module.get<JspsController>(JspsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
