import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AnalyzeDocumentService {
  private readonly client: DocumentAnalysisClient;

  constructor() {
    const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
    const credential = new AzureKeyCredential(
      process.env.FORM_RECOGNIZER_API_KEY,
    );
    this.client = new DocumentAnalysisClient(endpoint, credential);
  }

  async analyzeDocument(
    imageName: string,
    model: string,
  ): Promise<{ [key: string]: string }> {
    const readStream = fs.createReadStream(
      path.join('src/public/image/', imageName),
    );
    console.log(`Analyzing document using model ID ${model}...`);

    const poller = await this.client.beginAnalyzeDocument(model, readStream);
    const result = await poller.pollUntilDone();

    if (!result.documents || result.documents.length === 0) {
      throw new Error('Expected at least one document in the result.');
    }

    // Tạo một đối tượng JSON để chứa kết quả
    const documentResult: { [key: string]: string } = {};

    // Lặp qua các trường và thêm chúng vào đối tượng kết quả
    Object.entries(result.documents[0].fields).forEach(([name, field]) => {
      documentResult[name] = field.content;
    });

    const idNumberLength = documentResult['Id number'].length;
    if (idNumberLength !== 12) {
        console.log('id number length is ', idNumberLength);
        throw new BadRequestException('your id number is invalid');
    }

    return documentResult;
  }
}




