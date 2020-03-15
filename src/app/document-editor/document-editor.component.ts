import { ApiService } from './../api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ParagraphService } from './../paragraph.service';
import { Component, OnInit, Input } from '@angular/core';
import { DocumentService } from '../document.service';
import { DocumentDefinition } from '../interfaces/DocumentDefinition';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss']
})
export class DocumentEditorComponent implements OnInit {
  @Input() docDef: DocumentDefinition;
  content;
  paragraph;
  paragraphMeta;
  public Editor = ClassicEditor;

  constructor(
    private documentService: DocumentService,
    private paragraphService: ParagraphService,
    private httpClient: HttpClient,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.documentService.getDocument(this.docDef.path, this.docDef.name).subscribe((res) => {
      console.log('res', this.content)
      this.content = res;
    });
  }

  hover(event) {
    document.getElementById('boi').innerHTML = 'BOI YOURE HOVERING ' + event;
    this.paragraph = event;
    this.getParagraphMeta();
  }

  onContentChange(event) {

    // FIXME debounce trigger of save
    const htmlContent = event.editor.getData();
    console.log(htmlContent)
    const paragraphs = htmlContent.split(/<p>&nbsp;<\/p>/);
    let enhancedContent = '';
    for (let p of paragraphs) {
      if (p === '') continue;
      p = this.paragraphService.addParagraphIdentifierIfMissing(p)
      enhancedContent += `<p>&nbsp;</p>\n${p}\n`;

    }
    console.log('enhancedContent')
    console.log(enhancedContent)
    this.documentService.saveDocument(this.docDef.path, this.docDef.name, enhancedContent);
  }

  setParagraphMeta() {
    console.log('setParagraphMeta');
    const formdata = new FormData();
    formdata.append('doc_path', this.docDef.path);
    formdata.append('p_id', this.paragraph);
    formdata.append('content', 'dummy dummy dumdum');

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    this.httpClient.put(this.api.getParagraphRoute(this.docDef.name), formdata, { headers: httpHeaders })
      .pipe(catchError((err) => this.handleError(err)))
      .subscribe((res) => console.log('p put', res));
  }

  getParagraphMeta(): void {

    this.httpClient.get(this.api.getParagraphRoute(this.docDef.name) + `?doc_path=${this.docDef.path}&p_id=${this.paragraph}`)
      .pipe(catchError((err) => this.handleError(err)))
      .subscribe((res) => this.paragraphMeta = res);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
