// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { LabelInfo } from '@writerey/shared/models/notesItems.interface';
import { NoteItemStereotypes } from '@writerey/shared/models/notesItems.interface';
import { FADE_ANIMATIONS } from '@writerey/shared/utils/animation.utils';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Note } from '@writerey/shared/models/notesItems.interface';
import { LabelDefinition } from '@writerey/shared/models/labelDefinition.class';
import { rotateAnimation } from 'angular-animations';
import { getReadableNameForLabelContext } from '@writerey/shared/utils/label.utils';

@Component({
  selector: 'wy-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  animations: [...FADE_ANIMATIONS, rotateAnimation()],
})
export class NoteComponent implements OnInit {
  @Input() note: Note | LabelInfo;
  @Input() labelDefs: Array<LabelDefinition>;

  @Output() deleteNote = new EventEmitter<any>();
  @Output() editNote = new EventEmitter<any>();

  noteStyles = '';
  classes = 'note';
  contextName = '';
  isExpanded = false;
  isLabelInfo;
  noteForEditing;

  constructor() {}

  ngOnInit() {
    if (!this.note) return;

    if (this.note.stereotype !== NoteItemStereotypes.LABEL) {
      this.isExpanded = !!this.note.keepOpen;
    } else {
      this.isLabelInfo = true;
    }
    this.classes += ` type-${this.note.type}`;
    if (this.note.color) {
      this.noteStyles = 'background-color:' + this.note.color;
    }

    if (this.note.context.includes(':')) {
      this.contextName = getReadableNameForLabelContext(this.note.context, this.labelDefs);
    } else {
      this.contextName = this.note.context;
    }
  }

  delete() {
    this.deleteNote.emit(this.note);
  }

  switchToEditMode() {
    this.noteForEditing = Object.assign({}, this.note);
  }

  finishEditing($event) {
    this.note = Object.assign(this.note, $event);
    this.noteForEditing = null;
    this.editNote.emit(this.note);
  }

  changeKeepOpen() {
    this.note.keepOpen = !this.note.keepOpen;
    this.editNote.emit(this.note);
  }

  changeExpand() {
    this.isExpanded = !this.isExpanded;
  }

  cancelEdit() {
    this.noteForEditing = null;
  }

  getIconForType() {
    if (this.note?.stereotype === NoteItemStereotypes.LABEL) return 'location_on';
    switch (this.note?.type) {
      case 'todo':
        return 'assignment';
      case 'info':
      default:
        return 'info';
    }
  }
}
