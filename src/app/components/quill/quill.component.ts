import { DocumentService } from '../../services/document.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { throwError, from, Observable } from 'rxjs';
import { CompileTemplateMetadata } from '@angular/compiler';
import { QuillEditorComponent } from 'ngx-quill';

// FIXME if we wont use Quill anymore, remove the component

@Component({
  selector: 'wy-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss']
})
export class QuillComponent implements OnInit {
  @Input() content: string;

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

  @ViewChild('editor', {
    static: true
  }) editor: QuillEditorComponent;


  ngOnInit() {
  }

  onEditorCreated(event) {
    console.log(event)
    // this.form
    //   .controls
    //   .editor
    //   .valueChanges.pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((data) => {
    //     // tslint:disable-next-line:no-console
    //     console.log('native fromControl value changes with debounce', data)
    //   })

    this.editor
      .onContentChanged
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((data) => {
        // tslint:disable-next-line:no-console
        console.log('view child + directly subscription', data)
      })
  }

  onContentChange(event) {
    this.contentChange.emit(event);
  }
}
