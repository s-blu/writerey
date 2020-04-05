import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MarkerService } from 'src/app/services/marker.service';

@Component({
  selector: 'wy-create-new-note',
  templateUrl: './createNewNote.component.html',
  styleUrls: ['./createNewNote.component.scss'],
})
export class CreateNewNoteComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() markerDefs: Array<MarkerDefinition> = [];
  @Output() noteCreated = new EventEmitter<any>();

  createNewForm;

  private translatedContextNames = {
    paragraph: 'paragraph',
    document: 'document',
  };

  constructor(
    private translocoService: TranslocoService,
    private formBuilder: FormBuilder,
    private markerService: MarkerService
  ) {
    this.createNewForm = this.formBuilder.group({
      type: 'todo',
      color: '',
      context: this.contexts[0] || 'paragraph',
      text: '',
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
  }

  ngOnInit() {
    this.translatedContextNames.paragraph = this.translocoService.translate('createNote.contexts.paragraph');
    this.translatedContextNames.document = this.translocoService.translate('createNote.contexts.document');
  }

  onSubmit(data) {
    this.noteCreated.emit(data);
    this.createNewForm.reset();
    this.createNewForm.patchValue({ context: this.contexts[0] || 'paragraph', type: 'todo', color: '' });
  }

  getContextName(context: string) {
    return this.translatedContextNames[context] || context;
  }
}
