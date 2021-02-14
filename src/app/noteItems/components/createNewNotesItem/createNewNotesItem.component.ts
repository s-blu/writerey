// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { LabelDefinition } from '@writerey/shared/models/labelDefinition.class';
import { Link, Note, NoteItemStereotypes } from '@writerey/shared/models/notesItems.interface';
import { FADE_ANIMATIONS } from '@writerey/shared/utils/animation.utils';
import * as uuid from 'uuid';

@Component({
  selector: 'wy-create-new-notes-item',
  templateUrl: './createNewNotesItem.component.html',
  styleUrls: ['./createNewNotesItem.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class CreateNewNotesItemComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() labelDefs: Array<LabelDefinition> = [];
  @Output() itemCreated = new EventEmitter<any>();

  typesOfItems = NoteItemStereotypes;
  type = NoteItemStereotypes.NOTE;

  translatedContextNames = {
    paragraph: 'paragraph',
    document: 'document',
  };

  constructor(private translocoService: TranslocoService) {}

  ngOnChanges() {
    if (!this.contexts) return;
    for (const context of this.contexts) {
      if (context.includes(':')) {
        const [labelId, valueId] = context.split(':');
        const labelDef = this.labelDefs.find(m => m.id === labelId);
        const valueName = labelDef?.values?.find(v => v.id === valueId)?.name;
        this.translatedContextNames[context] = `[${labelDef?.name}] ${valueName}`;
      } else if (!this.translatedContextNames[context]) {
        this.translatedContextNames[context] = context;
      }
    }
  }

  ngOnInit() {
    this.translatedContextNames.paragraph = this.translocoService.translate('createNotesItem.contexts.paragraph');
    this.translatedContextNames.document = this.translocoService.translate('createNotesItem.contexts.document');
  }

  createNote(event) {
    if (!event) return;
    const newNote: Note = {
      stereotype: NoteItemStereotypes.NOTE,
      id: uuid.v4(),
      type: event.type,
      color: event.color,
      context: event.context,
      text: event.text,
    };

    this.itemCreated.emit(newNote);
  }

  createLink(event) {
    if (!event?.linkId) {
      console.warn('tried to create link without linkId. Aborting.', event);
      return;
    }
    const newLink: Link = {
      stereotype: NoteItemStereotypes.LINK,
      id: uuid.v4(),
      linkId: event.linkId,
      context: event.context,
      text: event.text,
      color: event.color,
    };
    this.itemCreated.emit(newLink);
  }
}
