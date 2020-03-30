import { TranslocoService } from '@ngneat/transloco';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'wy-create-new-note',
  templateUrl: './createNewNote.component.html',
  styleUrls: ['./createNewNote.component.scss']
})
export class CreateNewNoteComponent implements OnInit {
  @Input() contexts: Array<string>;
  @Output() noteCreated = new EventEmitter<any>();


  selectedContext = 'paragraph';
  comment: string;
  createNewForm;
  private translatedContextNames = {
    paragraph: 'paragraph',
    document: 'document'
  }

  constructor(
    private translocoService: TranslocoService,
    private formBuilder: FormBuilder,
  ) {
    this.createNewForm = this.formBuilder.group({
      context: 'paragraph',
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
    this.createNewForm.patchValue({ context: 'paragraph' });
  }

  getContextName(context: string) {
    return this.translatedContextNames[context] || context;
  }

  create() {

  }

}
