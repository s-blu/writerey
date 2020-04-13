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
  @Output() updateParagraphMeta: EventEmitter<any> = new EventEmitter();

  modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
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

  ngOnInit() {}

  onEditorCreated(event) {
    this.editor?.onContentChanged.pipe(distinctUntilChanged(), debounceTime(800)).subscribe(data => {
      this.contentChanged.emit(data.html);
    });

    this.editor?.onSelectionChanged.pipe(distinctUntilChanged(), debounceTime(500)).subscribe(data => {
      const el = (data?.editor?.getLine(data?.range?.index) || [])[0]?.domNode;
      if (el) this.updateParagraphMeta.emit(el.className);
    });
  }

  onEditorClick(event) {
    this.updateParagraphMeta.emit(event?.srcElement?.className);
  }
}
