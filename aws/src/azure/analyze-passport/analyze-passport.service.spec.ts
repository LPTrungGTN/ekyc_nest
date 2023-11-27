import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzePassportService } from './analyze-passport.service';

describe('AnalyzePassportService', () => {
  let service: AnalyzePassportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyzePassportService],
    }).compile();

    service = module.get<AnalyzePassportService>(AnalyzePassportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
