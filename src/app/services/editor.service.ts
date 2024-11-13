import { Injectable } from "@angular/core";
import { DecoupledEditor } from "ckeditor5";

@Injectable({
    providedIn: 'root'
  })
  export class EditorService {
    private editor: DecoupledEditor | undefined;
    constructor() { }
setEditor(editor: DecoupledEditor): void {
    this.editor = editor;
}

getEditor(): DecoupledEditor | undefined {
    return this.editor;
}

  }