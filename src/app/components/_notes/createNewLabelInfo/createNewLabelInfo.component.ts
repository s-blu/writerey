import { LabelDefinition } from 'src/app/models/labelDefinition.class';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { editorWyNotesModules, setDecoupledToolbar } from 'src/app/utils/editor.utils';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';

@Component({
  selector: 'wy-create-new-label-info',
  templateUrl: './createNewLabelInfo.component.html',
  styleUrls: ['./createNewLabelInfo.component.scss'],
})
export class CreateNewLabelInfoComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() labelDefinition: LabelDefinition;
  @Input() contextNames: any = {};
  @Output() labelInfoCreated = new EventEmitter<any>();

  noteColor;
  createNewForm;
  Editor = DecoupledEditor;
  editorConfig = editorWyNotesModules;
  onReady = setDecoupledToolbar;

  constructor(private formBuilder: FormBuilder) {
    this.createNewForm = this.formBuilder.group({
      context: this.contexts[0] || null,
      text: ' \n',
    });
  }

  ngOnChanges() {
    this.createNewForm.patchValue({ context: this.contexts[0] });
  }

  ngOnInit() {
    if (this.labelDefinition?.template) {
      this.createNewForm.patchValue({ text: this.labelDefinition.template });
    }
  }

  onSubmit(data) {
    this.labelInfoCreated.emit(data);
    this.createNewForm.patchValue({ text: this.labelDefinition?.template || '' });
  }
}
