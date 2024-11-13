import { Injectable } from '@angular/core';
import { DocumentAnalysisClient , AzureKeyCredential } from '@azure/ai-form-recognizer';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private subscriptionKey = '';
  private serviceRegion = 'uksouth';

  private client: DocumentAnalysisClient ;

  constructor() {
    const endpoint = 'https://composer-pdf-api.cognitiveservices.azure.com/';
    const apiKey = '7ZKAQlMZfwbJGdDtsBd6R3zodvlHWqJjb6oY8NhF63rWH8segLA1JQQJ99AKACmepeSXJ3w3AAALACOGY2fo';
    this.client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
   }

   public async transcribePdf(file: File): Promise<string> {
    const poller = await this.client.beginAnalyzeDocument('prebuilt-read', file);
    const result = await poller.pollUntilDone();

    if (!result || !result.pages || result.pages.length === 0) {
      throw new Error('No pages found in the PDF.');
    }

    let content = '';
    for (const page of result.pages) {
      content += page.lines.map(line => line.content).join('\n') + '\n';
    }
    return content;
  }
}
