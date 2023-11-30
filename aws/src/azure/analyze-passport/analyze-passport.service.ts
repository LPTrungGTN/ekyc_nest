import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';
import * as fs from 'fs';
import * as path from 'path';
import { Console } from 'console';

@Injectable()
export class AnalyzePassportService {
  private readonly client: DocumentAnalysisClient;

  constructor() {
    const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
    const credential = new AzureKeyCredential(
      process.env.FORM_RECOGNIZER_API_KEY,
    );
    this.client = new DocumentAnalysisClient(endpoint, credential);
  }

  async analyzePassport(
    imageName: string,
  ): Promise<{ [key: string]: string } | { error: string }> {
    const readStream = fs.createReadStream(
      path.join('src/public/image/', imageName),
    );
    const modelId = 'prebuilt-idDocument';

    console.log(`Analyzing document using model ID ${modelId}...`);

    const poller = await this.client.beginAnalyzeDocument(modelId, readStream);
    const result = await poller.pollUntilDone();

    if (!result.documents || result.documents.length === 0) {
      throw new Error('Expected at least one document in the result.');
    }

    const document = result.documents[0];

    if ('MachineReadableZone' in document.fields) {
      const machineReadableTexts =
        document.fields['MachineReadableZone']['properties'];

      const documentResult: { [key: string]: string } = {};

      for (const key in machineReadableTexts) {
        documentResult[key] = machineReadableTexts[key].value;
      }
      if (Object.keys(documentResult).length === 0) {
        throw new BadRequestException('your passport is not readable');
      }

      return documentResult;
    } else {
      console.log('cannot extract data');
      throw new BadRequestException('cannot extract data');
    }
  }
}
