import { Injectable } from '@nestjs/common';
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from '@azure/ai-form-recognizer';
import * as fs from 'fs';
import * as path from 'path';
import { machine } from 'os';

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
  ): Promise<string | { error: string }> {
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

      const result = [];

      for (const key in machineReadableTexts) {
        let value = machineReadableTexts[key].value;

        result.push(key + ':' + machineReadableTexts[key].value);
      }
      console.log(result);
    } else {
      console.log('cannot extract data');
      return { error: 'cannot extract data' };
    }
  }
}
