import { debounce, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Note } from '@writerey/shared/models/notesItems.interface';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { editorWyNotesModules, setDecoupledToolbar } from '@writerey/shared/utils/editor.utils';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';

const NOTE_DRAFT_KEY = 'writerey_note_draft_';

@Component({
  selector: 'wy-upsert-note',
  templateUrl: './upsertNote.component.html',
  styleUrls: ['./upsertNote.component.scss'],
})
export class UpsertNoteComponent implements OnInit, OnChanges, OnDestroy {
  @Input() contexts: Array<string> = [];
  @Input() contextNames: any = {};
  @Input() editNote?;
  @Output() noteCreated = new EventEmitter<any>();
  @Output() editCanceled = new EventEmitter<undefined>();

  noteColor;
  createNewForm;
  Editor = DecoupledEditor;
  editorConfig = editorWyNotesModules;
  onReady = setDecoupledToolbar;
  draft;

  private editorChangedSubject = new Subject();
  private subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {
    this.createNewForm = this.formBuilder.group({
      type: 'todo',
      color: '',
      context: this.contexts[0] || null,
      text: ' \n',
    });
  }

  ngOnChanges() {
    if (!this.contexts) return;
    this.createNewForm.patchValue({ context: this.contexts[0] });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.draft = localStorage.getItem(this.getDraftKey());

    const preset = {
      type: this.editNote?.type || 'todo',
      color: this.editNote?.color || '',
      context: this.editNote?.context || this.contexts?.[0] || null,
      text: this.draft || this.editNote?.text || ' \n',
    };

    this.createNewForm.patchValue(preset);

    this.subscription.add(
      this.editorChangedSubject.pipe(distinctUntilChanged(), debounceTime(600)).subscribe((ev: any) => {
        localStorage.setItem(this.getDraftKey(), ev.editor.getData());
      })
    );
  }

  onSubmit(data) {
    localStorage.removeItem(this.getDraftKey());
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

  editorChanged(event) {
    this.editorChangedSubject.next(event);
  }

  cancelEdit() {
    localStorage.removeItem(this.getDraftKey());
    this.editCanceled.emit();
  }

  private getDraftKey() {
    return NOTE_DRAFT_KEY + this.editNote?.id || 'new';
  }
}
