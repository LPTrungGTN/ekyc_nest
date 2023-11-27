import { Injectable } from '@nestjs/common';
import { DocumentAnalysisClient } from '@azure/ai-form-recognizer';
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
        return analyzeResult; // Trả về kết quả từ dịch vụ dự đoán
      } else {
        const [classifyResult, analyzeResult] = await Promise.all([
          this.classifyDocumentService.classifyDocument(imageName),
          this.analyzeDocumentService.analyzeDocument(imageName),
        ]);

        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;

        console.log(`Time : ${elapsedTime} s`);
        switch (type) {
          case DocumentType.residence_card:
            if (classifyResult === 'residence_card') {
              return analyzeResult; // Trả về kết quả từ dịch vụ dự đoán
            } else {
              return {
                // Trả về thông báo lỗi nếu phân loại sai
                error: 'please upload correct residence card',
              };
            }
          case DocumentType.lisense:
            if (classifyResult === 'lisense') {
              return analyzeResult; // Trả về kết quả từ dịch vụ dự đoán
            } else {
              return {
                // Trả về thông báo lỗi nếu phân loại sai
                error: 'please upload correct lisence',
              };
            }
          case DocumentType.my_number:
            if (classifyResult === 'my_number') {
              return analyzeResult; // Trả về kết quả từ dịch vụ dự đoán
            } else {
              return {
                // Trả về thông báo lỗi nếu phân loại sai
                error: 'please upload correct mynumber',
              };
            }
          case DocumentType.Vietnamese_idcard:
            if (classifyResult === 'Vietnamese_idcard') {
              return analyzeResult; // Trả về kết quả từ dịch vụ dự đoán
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
