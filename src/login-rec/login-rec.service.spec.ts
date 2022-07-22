import { Test, TestingModule } from '@nestjs/testing';
import { LoginRecService } from './login-rec.service';

describe('LoginRecService', () => {
  let service: LoginRecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginRecService],
    }).compile();

    service = module.get<LoginRecService>(LoginRecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
