import { TranslocoService } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, throwIfEmpty } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';

import { DocumentDefinition } from 'src/app/models/documentDefinition.interface';

@Component({
  selector: 'wy-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss'],
})
export class QuillComponent implements OnInit {
  @Input() content: string;
  @Input() isLoading: boolean;
  @Input() document: DocumentDefinition;

  @Output() contentChanged: EventEmitter<any> = new EventEmitter();
  @Output() updateParagraphMeta: EventEmitter<any> = new EventEmitter();

  introduction = '';
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

  @ViewChild('editor')
  editor: QuillEditorComponent;

  constructor(private http: HttpClient, private transloco: TranslocoService) {}

  ngOnInit() {
    const lang = this.transloco.getActiveLang();
    this.http.get(`assets/introduction_${lang}.html`, { responseType: 'text' }).subscribe((res: any) => {
      this.introduction = res || '';
    });
  }

  onEditorCreated(event) {
    this.editor.onContentChanged.pipe(distinctUntilChanged(), debounceTime(800)).subscribe(data => {
      this.contentChanged.emit(data);
    });

    this.editor.onSelectionChanged.pipe(distinctUntilChanged(), debounceTime(500)).subscribe(data => {
      const el = (data?.editor?.getLine(data?.range?.index) || [])[0]?.domNode;
      if (el) this.updateParagraphMeta.emit(el.className);
    });
  }

  onEditorClick(event) {
    this.updateParagraphMeta.emit(event?.srcElement?.className);
  }

  isReadOnly() {
    return this.isLoading || !this.document;
  }
}
