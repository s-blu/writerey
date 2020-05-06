import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { quillWyStyles, quillWyNotesModules } from 'src/app/utils/quill.utils';

@Component({
  selector: 'wy-create-new-note',
  templateUrl: './createNewNote.component.html',
  styleUrls: ['./createNewNote.component.scss'],
})
export class CreateNewNoteComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() labelMode: boolean;
  @Input() contextNames: any = {};
  @Output() noteCreated = new EventEmitter<any>();

  noteColor;
  createNewForm;
  quillConfig = {
    modules: quillWyNotesModules,
    styles: quillWyStyles,
  };

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
