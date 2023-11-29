import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentAnalysisClient } from '@azure/ai-form-recognizer';
import * as fs from 'fs';
import * as path from 'path';
import { ClassifyDocumentService } from './classify-document/classify-document.service';
import { AnalyzeDocumentService } from './analyze-document/analyze-document.service';
import { AnalyzePassportService } from './analyze-passport/analyze-passport.service';
import { DatabaseService } from './import-cardinfo/import-cardinfo.service';

import DocumentType from './document-type.enum';
import DocumentModelid from './document-modelid.enums';

@Injectable()
export class AzureService {
  private readonly client: DocumentAnalysisClient;
  private readonly classifyDocumentService: ClassifyDocumentService;
  private readonly analyzeDocumentService: AnalyzeDocumentService;
  private readonly AnalyzePassportService: AnalyzePassportService;
  private readonly databaseService: DatabaseService;

  constructor() {
    this.classifyDocumentService = new ClassifyDocumentService();
    this.analyzeDocumentService = new AnalyzeDocumentService();
    this.AnalyzePassportService = new AnalyzePassportService();
    this.databaseService = new DatabaseService();
  }

  async processImage(
    imageName: string,
    type: number,
  ): Promise<{ [key: string]: string }> {
    const imagePath = path.join('src/public/image/', imageName);

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException(`Image file not found: ${imagePath}`);
    }
    try {
      const startTime = performance.now();

      if (type === DocumentType.passport) {
        const [classifyResult, analyzeResult] = await Promise.all([
          this.classifyDocumentService.classifyDocument(imageName),
          this.AnalyzePassportService.analyzePassport(imageName),
        ]);
        if (classifyResult === 'passport') {
          this.databaseService.savePassportToDb(analyzeResult);
          return analyzeResult;
        } else
          throw new BadRequestException(
            'please upload correct ' + DocumentType[type],
          );
      } else {
        const [classifyResult, analyzeResult] = await Promise.all([
          this.classifyDocumentService.classifyDocument(imageName),
          this.analyzeDocumentService.analyzeDocument(
            imageName,
            DocumentModelid[type],
          ),
        ]);

        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        console.log(`Time : ${elapsedTime} s`);

        if (
          type === DocumentType.residence_card &&
          classifyResult === 'residence_card'
        ) {
          this.databaseService.saveResidenceToDb(analyzeResult);
          return analyzeResult;
        } else if (
          type === DocumentType.lisense &&
          classifyResult === 'lisense'
        ) {
          this.databaseService.saveLisenseToDb(analyzeResult);
          return analyzeResult;
        } else if (
          type === DocumentType.my_number &&
          classifyResult === 'my_number'
        ) {
          this.databaseService.saveMynumberToDb(analyzeResult);
          return analyzeResult;
        } else if (
          type === DocumentType.Vietnamese_idcard &&
          classifyResult === 'Vietnamese_idcard'
        ) {
          this.databaseService.saveVietnamesIdToDb(analyzeResult);
          return analyzeResult;
        } else
          throw new BadRequestException(
            'please upload correct ' + DocumentType[type],
          );
      }
    } catch (error) {
      console.error('Error:', error);
      throw new BadRequestException(error.message || 'Something went wrong');
    }
  }
}
