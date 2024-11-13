import { Component } from '@angular/core';
import { SpeechService } from '../speech.service';
import { CreateDocumentService } from '../create-document.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  selectedFile: File | null = null;  
  transcription: string = '';  
  
  constructor(
    private speechService: SpeechService,
    private createDiocumentService: CreateDocumentService
  ) {}  
  
  onFileSelected(event: Event): void {  
    const input = event.target as HTMLInputElement;  
    if (input.files && input.files.length > 0) {  
      this.selectedFile = input.files[0];  
    }  
  }  
  
  onSubmit(): void {  
    if (this.selectedFile) {  
      this.speechService.transcribeAudio(this.selectedFile).then(  
        (text) => {  
          this.transcription = text;  
        },  
        (error) => {  
          this.transcription = error;  
        }  
      );  
    }  
  }  
}
