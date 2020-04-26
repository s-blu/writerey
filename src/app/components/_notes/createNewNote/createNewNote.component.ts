import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { TranslocoService } from '@ngneat/transloco';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'wy-create-new-note',
  templateUrl: './createNewNote.component.html',
  styleUrls: ['./createNewNote.component.scss'],
})
export class CreateNewNoteComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() markerDefs: Array<MarkerDefinition> = [];
  @Output() noteCreated = new EventEmitter<any>();

  noteColor;
  createNewForm;
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['blockquote', 'code-block', 'link', 'image'], // add's image support
      ['clean'],
    ],
  };

  quillStyle = {
    'font-family': 'Roboto, "Helvetica Neue", sans-serif',
    'font-size': '14px',
  };

  private translatedContextNames = {
    paragraph: 'paragraph',
    document: 'document',
  };

  constructor(private translocoService: TranslocoService, private formBuilder: FormBuilder) {
    this.createNewForm = this.formBuilder.group({
      type: 'todo',
      color: '',
      context: this.contexts[0] || null,
      text: ' \n',
    });
  }

  ngOnChanges() {
    for (const context of this.contexts) {
      if (context.includes(':')) {
        const [markerId, valueId] = context.split(':');
        const markerDef = this.markerDefs.find(m => m.id === markerId);
        const valueName = markerDef?.values?.find(v => v.id === valueId)?.name;
        this.translatedContextNames[context] = `[${markerDef?.name}] ${valueName}`;
      }
    }
    this.createNewForm.patchValue({ context: this.contexts[0] });
  }

  ngOnInit() {
    this.translatedContextNames.paragraph = this.translocoService.translate('createNote.contexts.paragraph');
    this.translatedContextNames.document = this.translocoService.translate('createNote.contexts.document');
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

  getContextName(context: string) {
    return this.translatedContextNames[context] || context;
  }
}
