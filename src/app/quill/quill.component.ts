import { DocumentService } from './../document.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { catchError, debounceTime } from 'rxjs/operators';
import { throwError, from, Observable } from 'rxjs';
import { CompileTemplateMetadata } from '@angular/compiler';


@Component({
  selector: 'wy-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss']
})
export class QuillComponent {
  @Input() content = 'elo';

  @Output() contentChange: EventEmitter<any> = new EventEmitter();

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      ['clean'],
    ]
  };
  styles = {
    border: 'none',
    'font-family': '\'Noto Serif\', \'Libertinus Serif\', \'Palatino Linotype\', \'Book Antiqua\', serif',
    'font-size': '16px'
  };

  onContentChange(event) {
    this.contentChange.emit(event);
  }
}