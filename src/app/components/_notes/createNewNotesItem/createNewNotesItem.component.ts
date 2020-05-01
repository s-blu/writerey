import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { TranslocoService } from '@ngneat/transloco';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'wy-create-new-notes-item',
  templateUrl: './createNewNotesItem.component.html',
  styleUrls: ['./createNewNotesItem.component.scss'],
})
export class CreateNewNotesItemComponent implements OnInit, OnChanges {
  @Input() type: 'Note' | 'Link';
  @Input() contexts: Array<string> = [];
  @Input() markerDefs: Array<MarkerDefinition> = [];
  @Output() itemCreated = new EventEmitter<any>();

  quillConfig = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block', 'link', 'image'], // add's image support
        ['clean'],
      ],
    },
    styles: {
      'font-family': 'Roboto, "Helvetica Neue", sans-serif',
      'font-size': '14px',
    }
  }

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
    this.translatedContextNames.paragraph = this.translocoService.translate('createNote.contexts.paragraph');
    this.translatedContextNames.document = this.translocoService.translate('createNote.contexts.document');
  }

  onSubmit(data) {
    this.itemCreated.emit(data);
  }
}
