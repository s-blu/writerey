// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { LabelInfo } from './../../../models/notesItems.interface';
import { NoteItemStereotypes } from 'src/app/models/notesItems.interface';
import { FADE_ANIMATIONS } from '../../../utils/animation.utils';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Note } from '../../../models/notesItems.interface';
import { LabelDefinition } from 'src/app/models/labelDefinition.class';
import { rotateAnimation } from 'angular-animations';
import { getReadableNameForLabelContext } from 'src/app/utils/label.utils';

@Component({
  selector: 'wy-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  animations: [...FADE_ANIMATIONS, rotateAnimation()],
})
export class NoteComponent implements OnInit {
  @Input() note: Note | LabelInfo;
  @Input() labelDefs: Array<LabelDefinition>;
  @Input() labelMode: boolean;

  @Output() deleteNote = new EventEmitter<any>();
  @Output() editNote = new EventEmitter<any>();

  noteStyles = '';
  classes = 'note';
  contextName = '';
  isExpanded = false;
  noteForEditing;

  constructor() {}

  ngOnInit() {
    if (this.note.stereotype !== NoteItemStereotypes.LABEL) {
      this.classes += ` type-${this.note.type}`;
    }
    this.isExpanded = !!this.note.keepOpen;
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

  getIconForType() {
    if (this.note.stereotype === NoteItemStereotypes.LABEL) return 'location_on';
    switch (this.note.type) {
      case 'todo':
        return 'assignment';
      case 'info':
      default:
        return 'info';
    }
  }
}
