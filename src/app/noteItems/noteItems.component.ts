import { LabelStore } from './../stores/label.store';
import { EventEmitter } from '@angular/core';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DISTRACTION_FREE_STATES } from '@writerey/shared/models/distractionFreeStates.enum';
import { FADE_ANIMATIONS } from '@writerey/shared/utils/animation.utils';
import { DOC_MODES } from '@writerey/shared/models/docModes.enum';
import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentModeStore } from '../stores/documentMode.store';
import { DistractionFreeStore } from '../stores/distractionFree.store';

@Component({
  selector: 'wy-note-items',
  templateUrl: './noteItems.component.html',
  styleUrls: ['./noteItems.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class NoteItemsComponent implements OnInit, OnDestroy {
  @Input() set noteItems(n) {
    console.log('notes given', n);
    this.notes = n;
    this.filterNotes();
  }
  @Input() noteContexts;

  @Output() createdNoteItem = new EventEmitter();
  @Output() editedNoteItem = new EventEmitter();
  @Output() deletedNoteItem = new EventEmitter();

  notes;
  MODES = DOC_MODES;
  mode: DOC_MODES;
  distractionFreeState: DISTRACTION_FREE_STATES;
  DF_STATES = DISTRACTION_FREE_STATES;
  labelDefinitions;
  filteredNotes = {};
  filters = {
    todo: {
      available: false,
      isShown: true,
      icon: 'assignment',
    },
    info: {
      available: false,
      isShown: true,
      icon: 'info',
    },
    labelinfo: {
      available: false,
      isShown: true,
      icon: 'location_on',
    },
    link: {
      available: false,
      isShown: true,
      icon: 'link',
    },
  };

  private subscription = new Subscription();
  constructor(
    private documentModeStore: DocumentModeStore,
    private distractionFreeStore: DistractionFreeStore,
    private labelStore: LabelStore
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.labelStore.labelDefinitions$.subscribe(labelDefs => {
        this.labelDefinitions = labelDefs;
      })
    );
    this.subscription.add(
      this.distractionFreeStore.distractionFree$.subscribe(status => {
        this.distractionFreeState = status;
      })
    );

    this.subscription.add(this.documentModeStore.mode$.subscribe(mode => (this.mode = mode)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  editNotesItem(editedItem, oldContext?) {
    const context = oldContext || editedItem.context;
    const notes = this.notes[context];
    if (!notes) {
      console.warn('Could not find context collection for note. Do nothing.', editedItem);
      return;
    }
    const index = notes.findIndex(n => n.id === editedItem.id);
    if (index > -1) {
      notes.splice(index, 1, editedItem);
    } else {
      console.warn('Could not find note to edit in context. Do nothing.', editedItem);
      return;
    }
    this.editedNoteItem.emit({ context, notes });
  }

  deleteNotesItem(item) {
    let notes = this.notes[item.context];
    if (!notes) {
      console.warn('Could not find context collection for note. Do nothing.', item);
      return;
    }
    notes = notes.filter(n => n.id !== item.id);
    this.deletedNoteItem.emit({ context: item.context, notes });
  }

  createNewNote(event) {
    if (!event) return;
    const updatedMetaData = [event];
    if (this.notes && this.notes[event.context]) {
      updatedMetaData.push(...this.notes[event.context]);
    }
    this.createdNoteItem.emit({ context: event.context, updatedMetaData });
  }

  shouldShowNotes(): boolean {
    if (this.distractionFreeState === DISTRACTION_FREE_STATES.FULL) {
      return this.mode === DOC_MODES.REVIEW;
    }
    return this.mode !== DOC_MODES.READ;
  }

  filterNotes(typeOfNote?) {
    if (typeOfNote) {
      this.filters[typeOfNote].isShown = !this.filters[typeOfNote].isShown;
    }

    this.filteredNotes = {};
    for (const key of Object.keys(this.notes)) {
      this.filterNotesForContext(key);
    }
  }

  private filterNotesForContext(context) {
    if (!this.filteredNotes) this.filteredNotes = {};
    this.filteredNotes[context] = this.notes[context].filter(n => {
      const noteItemType = (n.type || n.stereotype || '').toLowerCase();
      if (this.filters[noteItemType]) {
        this.filters[noteItemType].available = true;
        return this.filters[noteItemType].isShown;
      }
      return true;
    });
  }
}
