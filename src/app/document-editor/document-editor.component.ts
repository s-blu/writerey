import { Component, OnInit, Input } from '@angular/core';
import { DocumentService } from '../document.service';
import { DocumentDefinition } from '../interfaces/DocumentDefinition';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit {
  @Input() docDef: DocumentDefinition;
  content;

  constructor(
    private documentService: DocumentService
  ) { }

  ngOnInit(): void {
    this.documentService.getDocument(this.docDef.path, this.docDef.name).subscribe((res) => {
      this.content = res;
    });
  }

  onContentChange(event) {
    console.log('changed editor');
    console.log(event);

    // FIXME debounce trigger of save
    this.documentService.saveDocument(this.docDef.path, this.docDef.name, event.html);
  }

}
