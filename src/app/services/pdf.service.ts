import { Injectable } from '@angular/core';
import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private subscriptionKey = '';
  private serviceRegion = 'uksouth';

  private client: DocumentAnalysisClient;

  constructor() {
    const endpoint = 'https://composer-pdf-api.cognitiveservices.azure.com/';
    const apiKey = '';
    this.client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  }

  public async transcribePdf(file: File): Promise<string> {
    if (!file) {
      return '';
    }
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

  public async extractTables(file: File): Promise<string> {
    if (!file) {
      return '';
    }
    const poller = await this.client.beginAnalyzeDocument('prebuilt-layout', file);
    const result = await poller.pollUntilDone();

    if (!result || !result.tables || result.tables.length === 0) {
      return '';
    }

    let searchValue = 'NET INCOME';
    let tableContent = '';
    for (const table of result.tables) {
      const tableHeader = table.cells.find(cell => cell.rowIndex === 2 && cell.content === searchValue);
      if (tableHeader) {
        tableContent += '<table border="1">\n';
        let currentRow = -1;
        for (const cell of table.cells) {
          if (cell.rowIndex < 1) {
            continue; // Ignore the first row
          }
          if (cell.rowIndex === 1) {
            if (cell.rowIndex !== currentRow) {
              if (currentRow !== -1) {
                tableContent += '</tr>\n';
              }
              tableContent += '<tr>\n';
              currentRow = cell.rowIndex;
            }
            if (cell.columnIndex === 1) {
              tableContent += `<th></th>\n`
              tableContent += `<th>${cell.content}</th>\n`;
            } else {
              tableContent += `<th>${cell.content}</th>\n`;
            }
            continue;
          }
          if (cell.rowIndex !== currentRow) {
            if (currentRow !== -1) {
              tableContent += '</tr>\n';
            }
            tableContent += '<tr>\n';
            currentRow = cell.rowIndex;
          }
          tableContent += `<td>${cell.content}</td>\n`;
        }
        tableContent += '</tr>\n</table>\n';
        break;  // Exit loop after finding the specified table
      }
    }
    console.log(tableContent);
    return tableContent;
  }

}
