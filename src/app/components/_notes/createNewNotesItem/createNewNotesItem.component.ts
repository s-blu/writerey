import { FADE_ANIMATIONS } from './../../../utils/animation.utils';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LabelDefinition } from 'src/app/models/labelDefinition.class';
import { TranslocoService } from '@ngneat/transloco';
import { FormBuilder } from '@angular/forms';
import * as uuid from 'uuid';
import { Note, NoteItemStereotypes, Link } from 'src/app/models/notesItems.interface';

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
  @Input() labelDefs: Array<LabelDefinition> = [];
  @Input() labelMode: boolean;
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
    };
    this.itemCreated.emit(newLink);
  }
}
