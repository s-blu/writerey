import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'wy-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit {
  // FIXME ckeditor itself needs a wrapped value, i.e. { content: string }
  @Input() content: any;

  // @Input() set content(value: string) {
  //   this.contentWrap.content = value;
  // }

  @Output() contentChange: EventEmitter<any> = new EventEmitter();
  @Output() hover: EventEmitter<any> = new EventEmitter();

  public Editor = ClassicEditor;
  public config = {
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList',
      '|', 'blockQuote', 'indent', 'outdent', '|', 'undo', 'redo'],
    extraPlugins: [AllowClassesOnP]
  };


  constructor() { }

  ngOnInit() { }

  onChange(event) {
    this.contentChange.emit(event);
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
