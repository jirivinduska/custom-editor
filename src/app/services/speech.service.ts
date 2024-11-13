import { Injectable } from '@angular/core';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private subscriptionKey = '';
  private serviceRegion = 'uksouth';

  constructor() { }

  transcribeAudio(audioFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(this.subscriptionKey, this.serviceRegion);
      const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(audioFile);
      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync(result => {
        if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          resolve(result.text);
        } else {
          reject('Speech not recognized.');
        }
      });
    });
  }
}
