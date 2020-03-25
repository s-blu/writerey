import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'wy-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit {
  @Input() readonly: boolean = false;
  @Input() content: { content: string };

  // @Input() set content(value: string) {
  //   this.contentWrap.content = value;
  // }

  @Output() editorBlur: EventEmitter<any> = new EventEmitter();
  @Output() hover: EventEmitter<any> = new EventEmitter();

  public Editor = ClassicEditor;
  public config = {
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList',
      '|', 'blockQuote', 'indent', 'outdent', '|', 'undo', 'redo'],
    extraPlugins: [AllowClassesOnP],
    wordCount: {
      container: document.getElementById('ckeditor-word-count-container'),
      onUpdate(event) { console.log('wordCount on update triggered', event) }
    }
  };


  constructor() { }

  ngOnInit() {
    console.log('osdugasud', document.getElementById('ckeditor-word-count-container'))
  }

  onBlur(event) {
    this.editorBlur.emit(event);
  }

  over(event) {
    this.hover.emit(event?.srcElement?.className);
  }
}

class AllowClassesOnP {
  editor;
  constructor(editor) {
    this.editor = editor;
  }
  init() { }

  // all of this needs to happen in afterInit to make sure paragraph is already there
  afterInit() {
    this.editor.model.schema.extend('paragraph', {
      allowAttributes: 'class'
    });

    this.editor.conversion.for('upcast').attributeToAttribute({
      model: {
        name: 'p',
        key: 'class'
      },
      view: 'class'
    });

    this.editor.conversion.for('downcast').add(dispatcher => {
      dispatcher.on(`attribute:class:paragraph`, (evt, data, conversionApi) => {
        const viewElement = conversionApi.mapper.toViewElement(data.item);

        conversionApi.writer.setAttribute('class', data.attributeNewValue, viewElement);
      });
    });
  }
}
