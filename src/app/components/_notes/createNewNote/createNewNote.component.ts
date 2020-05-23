import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { quillWyStyles, editorWyNotesModules } from 'src/app/utils/quill.utils';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'wy-create-new-note',
  templateUrl: './createNewNote.component.html',
  styleUrls: ['./createNewNote.component.scss'],
})
export class CreateNewNoteComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() contextNames: any = {};
  @Output() noteCreated = new EventEmitter<any>();

  Editor = DecoupledEditor;
  noteColor;
  createNewForm;
  editorConfig = editorWyNotesModules;

  constructor(private formBuilder: FormBuilder) {
    this.createNewForm = this.formBuilder.group({
      type: 'todo',
      color: '',
      context: this.contexts[0] || null,
      text: ' \n',
    });
  }

  ngOnChanges() {
    this.createNewForm.patchValue({ context: this.contexts[0] });
  }

  ngOnInit() {}

  public onReady(editor) {
    console.log(editor.ui);
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
  }

  onSubmit(data) {
    this.noteCreated.emit(data);
    this.createNewForm.patchValue({ text: '' });
  }

  changeColor() {
    const color = this.createNewForm.get('color')?.value;
    if (color) {
      this.noteColor = color;
    } else {
      this.noteColor = null;
    }
  }
}
