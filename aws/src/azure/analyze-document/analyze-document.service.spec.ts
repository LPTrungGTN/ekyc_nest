import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzeDocumentService } from './analyze-document.service';

describe('AnalyzeDocumentService', () => {
  let service: AnalyzeDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyzeDocumentService],
    }).compile();

    service = module.get<AnalyzeDocumentService>(AnalyzeDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
