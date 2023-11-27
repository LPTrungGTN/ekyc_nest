import { Injectable } from '@nestjs/common';
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';
import * as fs from 'fs';
import * as path from 'path';
import { ClassifyDocumentService } from './classify-document/classify-document.service';
import { AnalyzeDocumentService } from './analyze-document/analyze-document.service';
import { AnalyzePassportService } from './analyze-passport/analyze-passport.service';

import DocumentType from './document-type.enum';

@Injectable()
export class AzureService {
  private readonly client: DocumentAnalysisClient;
  private readonly classifyDocumentService: ClassifyDocumentService;
  private readonly analyzeDocumentService: AnalyzeDocumentService;
  private readonly AnalyzePassportService: AnalyzePassportService;

  constructor() {
    this.classifyDocumentService = new ClassifyDocumentService();
    this.analyzeDocumentService = new AnalyzeDocumentService();
    this.AnalyzePassportService = new AnalyzePassportService();
  }

  async processImage(
    imageName: string,
    type: number,
  ): Promise<{ [key: string]: any }[]> {
    const imagePath = path.join('src/public/image/', imageName);

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }
    try {
      //   const [classifyResult, analyzeResult] = await Promise.all([
      //     this.classifyDocumentService.classifyDocument(imageName),
      //     this.analyzeDocumentService.analyzeDocument(imageName),
      //   ]);
      const analyzeResult =
        await this.AnalyzePassportService.analyzePassport(imageName);
      return [[analyzeResult]];
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
