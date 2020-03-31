import { DocumentService } from '../../services/document.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { throwError, from, Observable } from 'rxjs';
import { CompileTemplateMetadata } from '@angular/compiler';
import { QuillEditorComponent } from 'ngx-quill';


import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;
// FIXME if we wont use Quill anymore, remove the component

@Component({
  selector: 'wy-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss'],
})
export class QuillComponent implements OnInit {
  @Input() content: string;
  @Input() readOnly: boolean;
 
  @Output() contentChanged: EventEmitter<any> = new EventEmitter();
  @Output() editorClicked: EventEmitter<any> = new EventEmitter();

  modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }]
    ],
  };
  styles = {
    border: 'none',
    'font-family': "'Noto Serif', 'Libertinus Serif', 'Palatino Linotype', 'Book Antiqua', serif",
    'font-size': '16px',
  };

  @ViewChild('editor', {
    static: true,
  })
  editor: QuillEditorComponent;

  ngOnInit() {
    console.log('wy quill loaded', this.content)
  }

  onEditorCreated() {
    this.editor.onContentChanged.pipe(debounceTime(400), distinctUntilChanged()).subscribe(data => {
      // tslint:disable-next-line:no-console
      console.log('view child + directly subscription');
      this.contentChanged.emit(data.html);
    });
  }

  onEditorClick(event) {
    console.log('on clicked', event)
    this.editorClicked.emit(event?.srcElement?.className);
  }
}
