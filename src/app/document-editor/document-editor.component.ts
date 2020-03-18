import { ApiService } from '../services/api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ParagraphService } from '../services/paragraph.service';
import { Component, OnInit, Input } from '@angular/core';
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

  constructor(
    private documentService: DocumentService,
    private paragraphService: ParagraphService
  ) { }

  ngOnInit(): void {
    this.documentService.getDocument(this.docDef.path, this.docDef.name).subscribe((res) => {
      //console.log('res', res)
      this.contentWrap.content = res;
    });
  }

  hover(event) {
    // TODO create a component to show information beside the paragraph and feed it here with data, i.e. the pargraph id
    this.paragraph = event;
    this.paragraphService.getParagraphMeta(this.docDef.path, this.docDef.name, this.paragraph);
  }

  onContentChange(event) {
    // FIXME debounce trigger of save
    const htmlContent = event.editor.getData();
    const enhancedContent = this.paragraphService.enhanceDocumentWithParagraphIds(htmlContent);

    this.documentService.saveDocument(this.docDef.path, this.docDef.name, enhancedContent);
  }
}
