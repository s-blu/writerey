import { FADE_ANIMATIONS } from './../../../utils/animation.utils';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { TranslocoService } from '@ngneat/transloco';
import { FormBuilder } from '@angular/forms';
import * as uuid from 'uuid';
import { Note } from 'src/app/models/note.interface';
import { Link } from 'src/app/models/link.interface';

enum typesOfItems {
  'note' = 'note',
  'link' = 'link',
}

@Component({
  selector: 'wy-create-new-notes-item',
  templateUrl: './createNewNotesItem.component.html',
  styleUrls: ['./createNewNotesItem.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class CreateNewNotesItemComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() markerDefs: Array<MarkerDefinition> = [];
  @Output() itemCreated = new EventEmitter<any>();

  typesOfItems = typesOfItems;
  type = typesOfItems.note;

  translatedContextNames = {
    paragraph: 'paragraph',
    document: 'document',
  };

  constructor(private translocoService: TranslocoService, private formBuilder: FormBuilder) {}

  ngOnChanges() {
    for (const context of this.contexts) {
      if (context.includes(':')) {
        const [markerId, valueId] = context.split(':');
        const markerDef = this.markerDefs.find(m => m.id === markerId);
        const valueName = markerDef?.values?.find(v => v.id === valueId)?.name;
        this.translatedContextNames[context] = `[${markerDef?.name}] ${valueName}`;
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
      stereotype: 'Note',
      id: uuid.v4(),
      type: event.type,
      color: event.color,
      context: event.context,
      text: event.text,
    };

    this.itemCreated.emit(newNote);
  }

  createLink(event) {
    const newLink: Link = {
      stereotype: 'Link',
      id: uuid.v4(),
      linkId: event.linkId,
      context: event.context,
      text: event.text,
    };
    console.log('newLink', newLink);
    this.itemCreated.emit(newLink);
  }
}
