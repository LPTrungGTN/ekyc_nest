import { Test, TestingModule } from '@nestjs/testing';
import { ClassifyDocumentService } from './classify-document.service';

describe('ClassifyDocumentService', () => {
  let service: ClassifyDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassifyDocumentService],
    }).compile();

    service = module.get<ClassifyDocumentService>(ClassifyDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
