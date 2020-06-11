// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Note } from 'src/app/models/notesItems.interface';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { editorWyNotesModules, setDecoupledToolbar } from 'src/app/utils/editor.utils';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';

@Component({
  selector: 'wy-upsert-note',
  templateUrl: './upsertNote.component.html',
  styleUrls: ['./upsertNote.component.scss'],
})
export class UpsertNoteComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() contextNames: any = {};
  @Input() editNote?;
  @Output() noteCreated = new EventEmitter<any>();

  noteColor;
  createNewForm;
  Editor = DecoupledEditor;
  editorConfig = editorWyNotesModules;
  onReady = setDecoupledToolbar;

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

  ngOnInit() {
    const preset = {
      type: this.editNote?.type || 'todo',
      color: this.editNote?.color || '',
      context: this.editNote?.context || this.contexts[0] || null,
      text: this.editNote?.text || ' \n',
    };

    this.createNewForm.patchValue(preset);
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
