import { Component, HostListener, ComponentFactoryResolver, ApplicationRef, Injector, NgZone, ComponentRef, ViewChild, ElementRef, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DecoupledEditor, Bold, Essentials, Italic, Highlight, Paragraph, Undo, EditorConfig, Heading, Underline, Strikethrough, Subscript, Superscript, List, Indent, FindAndReplace, Table, Autoformat, TextTransformation, Clipboard, HorizontalLine, Font, FontFamily, Title, Image, ImageInsert, WordCount, Link, TableCaption, TableToolbar } from 'ckeditor5';
import { FileReaderService } from './services/file-reader.service';
import { AngularDialogModal } from './plugins/angular-dialog/angular-dialog';
import { PortalModule, DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { EditorService } from './services/editor.service';
import { UploadComponent } from './upload/upload.component';


export interface CustomEditorConfig extends EditorConfig {
  render: (element: HTMLElement) => void;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CKEditorModule, PortalModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {

  @ViewChild('toolbar') toolbar: ElementRef;

  constructor(fileReader: FileReaderService, private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector, private editorService: EditorService, private ngZone: NgZone) {
  }

  public Editor = DecoupledEditor;
  public words = signal(0);
  public characters = signal(0);
  public config: CustomEditorConfig = {
    plugins: [Autoformat, Bold, TextTransformation, Essentials, Italic, Paragraph, Undo, Heading, Underline, Strikethrough, Subscript, Superscript, Highlight, List, Indent, FindAndReplace, Table, Clipboard, HorizontalLine, Font, FontFamily, Title, AngularDialogModal, Image, ImageInsert, WordCount, Link, TableCaption, TableToolbar],
    toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|', 'heading', 'fontFamily', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|', 'highlight', '|', 'numberedList', 'bulletedList', '|',
      'indent', 'outdent', '|', 'findAndReplace', '|', 'insertTable', 'imageInsert', 'link', 'horizontalLine', 'showModal'],
    placeholder: 'Type the content here!',
    title: {
      placeholder: 'Article title',
    },
    table: {
      contentToolbar: [
          'toggleTableCaption'
      ]
  }
    ,
    render: (element: HTMLElement) => this.ngZone.run(() => this.renderComponent(element))
  };
  editorInstance: DecoupledEditor | undefined;

  @HostListener('window:keydown.control.s', ['$event'])
  onControlS(event: KeyboardEvent) {
    event.preventDefault();
    console.log(this.editorInstance?.getData());
  }

  public onReady(editor: DecoupledEditor): void {
    this.editorInstance = editor;
    this.editorService.setEditor(editor);
    this.toolbar.nativeElement.appendChild(editor.ui.view.toolbar.element);
    this.words.set(this.editorInstance.plugins.get(WordCount).words);
    this.characters.set(this.editorInstance.plugins.get(WordCount).characters);

    this.editorInstance.plugins.get(WordCount).on('update', (evt, stats) => {
      this.words.set(stats.words);
      this.characters.set(stats.characters);
    });
  }

  onError($event: unknown) {
    console.log($event);
  }

  renderComponent(element: HTMLElement): ComponentRef<UploadComponent> {
    const portal = new DomPortalOutlet(element, this.componentFactoryResolver, this.appRef, this.injector);
    const componentPortal = new ComponentPortal(UploadComponent);
    return portal.attach(componentPortal);
  }
}
