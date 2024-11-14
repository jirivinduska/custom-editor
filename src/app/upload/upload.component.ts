import { Component, ElementRef, ViewChild } from '@angular/core';
import { SpeechService } from '../services/speech.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../services/chat.service';
import { JokesService } from '../services/jokes.service';
import { PdfService } from '../services/pdf.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { interval, map, Subscription } from 'rxjs';
import { FinacialDataService } from '../services/financial-data.service';





@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule, CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  selectedFile: File | null = null;
  selectedPdfFile: File | null = null;
  transcription: string = '';
  isLoading: boolean = false;
  isDone:boolean = false;
  loadingLabel: string = '';
  fileLabel: string = 'Choose Audio File';
  fileLabelPdf: string = 'Choose PDF File';
  joke: string = '';
  private subscription: Subscription;

  constructor(
    private speechService: SpeechService,
    private chatService: ChatService,
    private jokesService: JokesService,
    private pdfService: PdfService,
    private financialDateService: FinacialDataService
  ) {
    this.joke = jokesService.getJoke();
    this.subscription = interval(10000) // Repeat every 5 seconds
    .pipe(
      map(() => jokesService.getJoke())
    )
    .subscribe(data => {
      this.joke = data;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileLabel = this.selectedFile.name;
    }
  }

  onPdfFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPdfFile = input.files[0];
      this.fileLabelPdf = this.selectedPdfFile.name;
    }
  }

  onSubmit(): void {
    if (this.selectedFile || this.selectedPdfFile) {
      this.isLoading = true;
      this.isDone = false;
      this.loadingLabel = 'Converting speech to text...';
      this.speechService.transcribeAudio(this.selectedFile).then(
        (audioText) => {
          this.loadingLabel = 'Extracting text from PDF...';
          this.pdfService.transcribePdf(this.selectedPdfFile).then(
            (pdfText) => {
              this.loadingLabel = 'Extracting data from PDF...';
              this.pdfService.extractTables(this.selectedPdfFile).then(
                (table) => {
                  this.loadingLabel = 'Writing report...';
                  this.chatService.generate(pdfText, audioText).then(
                    (html) => {
                      this.loadingLabel = "Adding finacial data...";
                      this.financialDateService.addTable(html, table).then(
                        (success) => {
                          this.transcription = success;
                          this.isLoading = false;
                          this.isDone = true;
                          this.loadingLabel = '';
                        },
                        (error) => {
                          this.transcription = error;
                          this.isLoading = false;
                          this.isDone = true;
                          this.loadingLabel = '';
                        }
                      );
                    },
                    (error) => {
                      this.transcription = error;
                      this.isLoading = false;
                      this.isDone = true;
                      this.loadingLabel = '';
                    }
                  );
                },
                (error) => {
                  this.transcription = error;
                  this.isLoading = false;
                  this.isDone = true;
                  this.loadingLabel = '';
                }
              )
            },
            (error) => {
              this.transcription = error;
              this.isLoading = false;
              this.isDone = true;
              this.loadingLabel = '';
            }
          )

        },
        (error) => {
          this.transcription = error;
          this.isLoading = false;
          this.isDone = true;
          this.loadingLabel = '';
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
