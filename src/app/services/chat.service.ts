import { Injectable, ɵɵsetComponentScope } from '@angular/core';
import { AzureOpenAI } from 'openai';
import { map, Observable, reduce } from 'rxjs';

const endpoint = 'https://genai-openai-composerbrain.openai.azure.com/';
const apiKey = '';
const apiVersion = '2024-05-01-preview';
const deployment = 'gpt-4o';
const searchEndpoint = 'https://composer.search.windows.net/';
const searchKey = '';
const searchIndex = 'composer-2';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly prompt = `I will generate comprehensive Earnings Call financial report for you using Earning Results and your Talking Points. Please provide them. Generated report will have the following properties:

  # Output Format
The article should be structured with clear paragraphs and headings to separate sections. Use subheadings if necessary to enhance readability. Output HTML.

# Notes
- I will assume the report is a written publication not a speech, and hence won't use expressions like "good morning everyone".
- I will include table with data
- After the first h1 heading, I will insert plain html <img> tag with "/audio.png" as source for the image.`;
  private client: AzureOpenAI;

  constructor() {
    this.client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });
  }

  async generate(earningResults: string, audioText): Promise<string> {
    const result = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: this.prompt },
        { role: "user", content: `Talking Points=${audioText}; Earning Results=${earningResults};` },
      ],
      model: 'gpt-4o',
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null,
      // @ts-ignore
      // data_sources: [{
      //   type: "azure_search",
      //   parameters: {
      //     endpoint: searchEndpoint,
      //     index_name: searchIndex,
      //     authentication: {
      //       type: "api_key",
      //       key: searchKey
      //     }
      //   }
      // }]
    });
    let html = '';
    for (const choice of result.choices) {
      html += choice.message.content;
    }
    console.debug(html);
    const elem = document.createElement('div');
    elem.innerHTML = html.replace('```html\n', '').replace('```', '');
    return elem.innerHTML;
  }
}
