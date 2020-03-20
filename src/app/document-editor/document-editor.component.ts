import { ApiService } from '../services/api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ParagraphService } from '../services/paragraph.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentService } from '../services/document.service';
import { DocumentDefinition } from '../interfaces/DocumentDefinition';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit {
  @Input() docDef: DocumentDefinition;
  contentWrap = { content: '' };
  paragraph;

  @Output() hover: EventEmitter<any> = new EventEmitter();

  constructor(
    private documentService: DocumentService,
    private paragraphService: ParagraphService
  ) { }

  ngOnInit(): void {
    this.documentService.getDocument(this.docDef.path, this.docDef.name).subscribe((res) => {
      this.contentWrap.content = res;
    });
  }

  onHover(event) {

    const dummyData = []
    for (let i = 0; i < 3; i++) {
      dummyData.push({
        type: 'info',
        color: Math.random() > 0.5 ? '' : '#88ff84',
        context: 'Paragraph',
        text: Math.random() > 0.5 ? 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
          : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.'
      })
    }


    if (RegExp(this.paragraphService.UUID_V4_REGEX_STR).test(event)) {
      this.paragraph = event;

      this.paragraphService.getParagraphMeta(this.docDef.path, this.docDef.name, this.paragraph)
        .subscribe((res) => {
          if (res === '') {
            this.paragraphService.setParagraphMeta(this.docDef.path, this.docDef.name, this.paragraph, dummyData);
          }
          this.hover.emit(event)
        });
    }
  }

  onContentChange(event) {
    // FIXME debounce trigger of save
    const htmlContent = event.editor.getData();
    const enhancedContent = this.paragraphService.enhanceDocumentWithParagraphIds(htmlContent);

    this.documentService.saveDocument(this.docDef.path, this.docDef.name, enhancedContent);
  }
}
