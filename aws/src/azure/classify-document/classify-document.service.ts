// src/services/classify-document.service.ts
import { Injectable } from '@nestjs/common';
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ClassifyDocumentService {
  private readonly endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
  private readonly credential = new AzureKeyCredential(
    process.env.FORM_RECOGNIZER_API_KEY,
  );
  private readonly client = new DocumentAnalysisClient(
    this.endpoint,
    this.credential,
  );

  async classifyDocument(imageName: string): Promise<string> {
    const readStream = fs.createReadStream(
      path.join('src/public/image/', imageName),
    );

    const classifierId = process.env.CUSTOM_CLASSIFIER_ID;

    console.log(`Classifying document using classifier ID ${classifierId}...`);

    const poller = await this.client.beginClassifyDocument(
      classifierId,
      readStream,
    );
    const result = await poller.pollUntilDone();

    if (!result.documents || result.documents.length === 0) {
      throw new Error('Failed to extract any documents.');
    }

    const document = result.documents[0];
    console.log(
      `Extracted a document with type '${document.docType}' (confidence: ${document.confidence})`,
    );
    return document.docType;
  }
}
