import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'wy-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
})
export class CkeditorComponent implements OnInit, OnDestroy {
  @Input() readonly = false;
  // @Input() set content(c: string) {
  //   console.log('got new content', c);
  //   if (c !== undefined) this.contentWrap.content = c;
  // }
  @Input() content: string;

  @Output() editorBlur: EventEmitter<any> = new EventEmitter();
  @Output() editorChange: EventEmitter<any> = new EventEmitter();
  @Output() editorClicked: EventEmitter<any> = new EventEmitter();

  public contentWrap = { content: null };
  public Editor = ClassicEditor;
  public config = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'numberedList',
      'bulletedList',
      '|',
      'blockQuote',
      'indent',
      'outdent',
      '|',
      'undo',
      'redo',
    ],
    extraPlugins: [],
    wordCount: {
      // FIXME
      container: document.getElementById('ckeditor-word-count-container'),
      onUpdate(event) {
        console.log('wordCount on update triggered', event);
      },
    },
  };

  private changeDebounce = new Subject();
  private subscription = new Subscription();
  constructor() {}

  ngOnInit() {
    let ed;
    ClassicEditor.create(document.querySelector('.editorbby'))
      .then(editor => {
        ed = editor;
        ed.model.document.on('change:data', (ev) => {
          console.log('The data has changed!');
        });

        console.log(editor);
      })
      .catch(error => {
        console.error(error);
      });

    this.subscription.add(
      this.changeDebounce
        .pipe(distinctUntilChanged(), debounceTime(600))
        .subscribe(event => this.editorChange.emit(event))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onBlur(event) {
    this.editorBlur.emit(event);
  }
  onChange(event) {
    this.changeDebounce.next(event);
  }

  onEditorClick(event) {
    this.editorClicked.emit(event?.srcElement?.className);
  }
}

class AllowClassesOnP {
  editor;
  constructor(editor) {
    this.editor = editor;
  }
  init() {}

  // all of this needs to happen in afterInit to make sure paragraph is already there
  afterInit() {
    this.editor.model.schema.extend('paragraph', {
      allowAttributes: 'class',
    });

    this.editor.conversion.for('upcast').attributeToAttribute({
      model: {
        name: 'p',
        key: 'class',
      },
      view: 'class',
    });

    this.editor.conversion.for('downcast').add(dispatcher => {
      dispatcher.on(`attribute:class:paragraph`, (evt, data, conversionApi) => {
        const viewElement = conversionApi.mapper.toViewElement(data.item);

        conversionApi.writer.setAttribute('class', data.attributeNewValue, viewElement);
      });
    });
  }
}
