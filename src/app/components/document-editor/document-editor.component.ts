import { ParagraphService } from '../../services/paragraph.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { DocumentDefinition } from '../../interfaces/documentDefinition.interface';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit {
  paragraphId: string;
  @Input() isLoading: boolean;
  @Input() document: DocumentDefinition;
  @Input() content: { content: string };

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

      this.paragraphService.getParagraphMeta(this.document.path, this.document.name, this.paragraphId, 'notes')
        .subscribe((res) => {
          if (res === '') {
            this.paragraphService.setParagraphMeta(this.document.path, this.document.name, this.paragraphId, 'notes', dummyData)
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

    this.documentService.saveDocument(this.document.path, this.document.name, event.editor.getData()).subscribe(res => res);
  }
}
