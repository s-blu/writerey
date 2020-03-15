import { ParagraphService } from './../paragraph.service';
import { Component, OnInit, Input } from '@angular/core';
import { DocumentService } from '../document.service';
import { DocumentDefinition } from '../interfaces/DocumentDefinition';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit {
  @Input() docDef: DocumentDefinition;
  content;
  public Editor = ClassicEditor;

  constructor(
    private documentService: DocumentService,
    private paragraphService: ParagraphService
  ) { }

  ngOnInit(): void {
    this.documentService.getDocument(this.docDef.path, this.docDef.name).subscribe((res) => {
      console.log('res', this.content)
      this.content = res;
    });
  }

  onContentChange(event) {

    // FIXME debounce trigger of save
    const htmlContent = event.editor.getData();
    console.log(htmlContent)
    const paragraphs = htmlContent.split(/<p>&nbsp;<\/p>/);
    let enhancedContent = '';
    for (let p of paragraphs) {
      p = this.paragraphService.addParagraphIdentifierIfMissing(p)
      enhancedContent += `<p>&nbsp;</p>\n${p}\n`;

    }
    console.log('enhancedContent')
    console.log(enhancedContent)
    this.documentService.saveDocument(this.docDef.path, this.docDef.name, enhancedContent);
  }
}
