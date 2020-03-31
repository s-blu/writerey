import { TranslocoService } from '@ngneat/transloco';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'wy-create-new-note',
  templateUrl: './createNewNote.component.html',
  styleUrls: ['./createNewNote.component.scss']
})
export class CreateNewNoteComponent implements OnInit {
  @Input() contexts: Array<string> = [];
  @Output() noteCreated = new EventEmitter<any>();

  createNewForm;
  private translatedContextNames = {
    paragraph: 'paragraph',
    document: 'document'
  };

  constructor(
    private translocoService: TranslocoService,
    private formBuilder: FormBuilder,
  ) {
    this.createNewForm = this.formBuilder.group({
      type: 'todo',
      color: '',
      context: this.contexts[0] || 'paragraph',
      text: ''
    });
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
