import { debounceTime } from 'rxjs/operators';
import { ParagraphService } from '../../services/paragraph.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { DocumentDefinition } from '../../interfaces/DocumentDefinition';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit {
  contentWrap = { content: '' };
  paragraphId: string;
  docDef: DocumentDefinition;
  isLoading: boolean;

  @Input()
  set document(docDef: DocumentDefinition) {
    console.log('called setter for DocDef', docDef)
    this.docDef = docDef;
    this.isLoading = true;
    this.documentService.getDocument(docDef.path, docDef.name)
      .subscribe((res) => {
        this.isLoading = false;
        this.contentWrap.content = res;
      });
    // todo catch error 
  }

  @Output() hover: EventEmitter<any> = new EventEmitter();

  constructor(
    private documentService: DocumentService,
    private paragraphService: ParagraphService
  ) { }

  ngOnInit(): void { }

  onHover(event) {

    const dummyData = []
    const no = Math.random() * 10;
    for (let i = 0; i < no; i++) {
      dummyData.push({
        type: 'info',
        color: Math.random() > 0.7 ? Math.random() > 0.4 ? '#d2fbd6' : '#fbd2d2' : '',
        context: 'Paragraph',
        text: Math.random() > 0.7 ? Math.random() > 0.3 ? 'consetetur sadipscing elitr' : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
          : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.'
      })
    }


    if (RegExp(this.paragraphService.UUID_V4_REGEX_STR).test(event)) {
      this.paragraphId = event;

      this.paragraphService.getParagraphMeta(this.docDef.path, this.docDef.name, this.paragraphId, 'notes')
        .subscribe((res) => {
          if (res === '') {
            this.paragraphService.setParagraphMeta(this.docDef.path, this.docDef.name, this.paragraphId, 'notes', dummyData)
              .subscribe((res2) => console.log('setPar called', res2));
          }
          this.hover.emit(event);
        });
    }
  }

  onBlur(event) {
    console.log('document editor on blur')
    // FIXME debounce trigger of save
    const htmlContent = event.editor.getData();

    this.documentService.saveDocument(this.docDef.path, this.docDef.name, event.editor.getData()).subscribe(res => res);
  }
}
