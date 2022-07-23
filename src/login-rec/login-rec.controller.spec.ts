import { Test, TestingModule } from '@nestjs/testing';
import { LoginRecController } from './login-rec.controller';
import { LoginRecService } from './login-rec.service';

describe('LoginRecController', () => {
  let controller: LoginRecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginRecController],
      providers: [LoginRecService],
    }).compile();

    controller = module.get<LoginRecController>(LoginRecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
