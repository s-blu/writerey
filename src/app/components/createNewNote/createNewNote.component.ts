import { TranslocoService } from '@ngneat/transloco';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

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
  private translatedContextNames = {
    paragraph: 'paragraph',
    document: 'document'
  }

  constructor(
    private translocoService: TranslocoService
  ) { }

  ngOnInit() {
    this.translatedContextNames.paragraph = this.translocoService.translate('createNote.contexts.paragraph');
    this.translatedContextNames.document = this.translocoService.translate('createNote.contexts.document');
  }

  getContextName(context: string) {
    return this.translatedContextNames[context] || context;
  }

  create() {
    
  }

}
