import { debounce, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Note } from '@writerey/shared/models/notesItems.interface';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { editorWyNotesModules, setDecoupledToolbar } from '@writerey/shared/utils/editor.utils';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';

export const NOTE_DRAFT_KEY = 'writerey_note_draft_';

@Component({
  selector: 'wy-upsert-note',
  templateUrl: './upsertNote.component.html',
  styleUrls: ['./upsertNote.component.scss'],
})
export class UpsertNoteComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
  private componentInitialized = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnChanges() {
    if (!this.contexts) return;
    this.createNewForm?.patchValue({ context: this.contexts[0] });
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

    this.createNewForm = this.formBuilder.group(preset);

    this.subscription.add(
      this.editorChangedSubject.pipe(distinctUntilChanged(), debounceTime(600)).subscribe((ev: any) => {
        if (ev?.editor?.sourceElement?.innerText?.trim() !== '') {
          localStorage.setItem(this.getDraftKey(), ev.editor.getData());
        } else {
          localStorage.removeItem(this.getDraftKey());
        }
      })
    );
  }

  // workaround to fix ExpressionChangedAfterItHasBeenCheckedError of form.invalid
  ngAfterViewInit() {
    this.componentInitialized = true;
  }

  isInvalid() {
    if (!this.componentInitialized) {
      return true;
    }
    return this.createNewForm?.invalid;
  }
  // workaround end

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
    if (this.editNote) {
      return NOTE_DRAFT_KEY + this.editNote.id;
    }
    return NOTE_DRAFT_KEY + 'new';
  }
}
