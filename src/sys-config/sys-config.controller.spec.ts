import { Test, TestingModule } from '@nestjs/testing';
import { SysConfigController } from './sys-config.controller';
import { SysConfigService } from './sys-config.service';

describe('SysConfigController', () => {
  let controller: SysConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysConfigController],
      providers: [SysConfigService],
    }).compile();

    controller = module.get<SysConfigController>(SysConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
