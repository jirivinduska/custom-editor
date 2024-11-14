import { Injectable } from '@angular/core';
import { DocumentAnalysisClient , AzureKeyCredential } from '@azure/ai-form-recognizer';

@Injectable({
  providedIn: 'root'
})
export class FinacialDataService {
  private subscriptionKey = '';
  private serviceRegion = 'uksouth';

  private client: DocumentAnalysisClient ;

  constructor() {
    const endpoint = 'https://composer-pdf-api.cognitiveservices.azure.com/';
    const apiKey = '';
    this.client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
   }

   public async addTable(string: string, table: string): Promise<string> {
    await this.wait(3000);
    return string.replace('[INPUT DATA HERE]', table);
  }

  private wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private mockTable(): string {
    return `<table>
  <thead>
    <tr>
      <th>Year</th>
      <th>2023</th>
      <th>2022</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Net income/loss (thousands)</td>
      <td>932,902</td>
      <td>1,405,007</td>
    </tr>
    <tr>
      <td>Average assets</td>
      <td>173,296,902</td>
      <td>169,706,317</td>
    </tr>
    <tr>
      <td>Average equity</td>
      <td>17,491,591</td>
      <td>21,345,060</td>
    </tr>
  </tbody>
</table>
`;
  }
}
