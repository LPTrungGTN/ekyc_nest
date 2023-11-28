import { Injectable } from '@nestjs/common';
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
      throw new Error(`Image file not found: ${imagePath}`);
    }
    try {
      const startTime = performance.now();
      if (type === DocumentType.passport) {
        const analyzeResult =
          await this.AnalyzePassportService.analyzePassport(imageName);
        return analyzeResult;
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

        // loop
        // console.log("document type ls",DocumentType[1]);

        console.log(`Time : ${elapsedTime} s`);
        switch (type) {
          case DocumentType.residence_card:
            if (classifyResult === 'residence_card') {
              this.databaseService.saveDataToDatabase(analyzeResult);

              return analyzeResult;
            } else {
              return {
                // Trả về thông báo lỗi nếu phân loại sai
                error: 'please upload correct residence card',
              };
            }
          case DocumentType.lisense:
            if (classifyResult === 'lisense') {
              return analyzeResult;
            } else {
              return {
                // Trả về thông báo lỗi nếu phân loại sai
                error: 'please upload correct lisence',
              };
            }
          case DocumentType.my_number:
            if (classifyResult === 'my_number') {
              return analyzeResult;
            } else {
              return {
                // Trả về thông báo lỗi nếu phân loại sai
                error: 'please upload correct mynumber',
              };
            }
          case DocumentType.Vietnamese_idcard:
            if (classifyResult === 'Vietnamese_idcard') {
              return analyzeResult;
            } else {
              return {
                // Trả về thông báo lỗi nếu phân loại sai
                error: 'please upload correct Vietnamese idcard',
              };
            }
          default:
            return {
              // Trả về thông báo lỗi nếu không xác định được loại tài liệu
              error: 'please upload correct DocumentType',
            };
        }
      }
    } catch (error) {
      console.error('Error:', error);
      return { error: 'An error occurred' };
    }
  }
}
