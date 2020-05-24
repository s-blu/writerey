import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as CkEditorDecoubled from '@ckeditor/ckeditor5-build-decoupled-document';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'wy-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
})
export class CkeditorComponent implements OnInit, OnDestroy {
  @Input() set readonly(readonly: boolean) {
    if (this.editor) this.editor.isReadOnly = readonly;
  }
  @Input() set content(c: string) {
    if (c !== this.editorData) {
      this.editorData = c;
      if (this.editor) {
        this.editor.setData(c);
      }
    }
  }

  @Output() editorBlur: EventEmitter<any> = new EventEmitter();
  @Output() editorChange: EventEmitter<any> = new EventEmitter();
  @Output() editorClicked: EventEmitter<any> = new EventEmitter();

  private editorData: string;
  public editor: CkEditorDecoubled;
  public config = {
    toolbar: [
      'heading',
      'alignment',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      '|',
      'link',
      'numberedList',
      'bulletedList',
      '|',
      'blockQuote',
      'indent',
      'outdent',
      '|',
      'fontColor',
      'fontBackgroundColor',
      'insertTable',
      '|',
      'undo',
      'redo',
    ],
    extraPlugins: [AllowClassesOnP],
  };

  private changeDebounce = new Subject();
  private subscription = new Subscription();
  constructor() {}

  ngOnInit() {
    CkEditorDecoubled.create(document.querySelector('#ckeditor-container'), this.config)
      .then(editor => {
        editor.setData(this.editorData);
        editor.model.document.on('change:data', ev => {
          console.log('The data has changed!');
          this.changeDebounce.next(ev);
        });
        editor.editing.view.document.on('blur', ev => {
          console.log('Blurred');
          this.editorBlur.emit(ev);
        });

        const toolbarContainer = document.querySelector('#ckeditor-toolbar-container');
        if (toolbarContainer) toolbarContainer.appendChild(editor.ui.view.toolbar.element);

        this.editor = editor;
      })
      .catch(error => {
        console.error(error);
      });

    this.subscription.add(
      this.changeDebounce.pipe(distinctUntilChanged(), debounceTime(1000)).subscribe(async (event: any) => {
        this.sendChangeEvent(event);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    const toolbarContainer = document.querySelector('#ckeditor-toolbar-container');
    if (toolbarContainer) {
      try {
        toolbarContainer.removeChild(this.editor.ui.view.toolbar.element);
      } catch (e) {
        console.warn('Could not remove editor toolbar on destroy', e);
      }
    }
    this.editor.destroy().catch(error => {
      console.log('destroying editor failed', error);
    });
  }

  onBlur(event) {
    this.editorBlur.emit(event);
  }
  onChange(event) {
    this.changeDebounce.next(event);
  }

  onEditorClick(event) {
    const className = event?.srcElement?.className || event?.srcElement?.parentNode?.className;
    this.editorClicked.emit(className);
  }

  private sendChangeEvent(event) {
    event.content = this.editor.getData();
    event.plainContent = this.editor.sourceElement.innerText;
    console.log(new Date().toISOString() + ' !!! sending change event');
    this.editorChange.emit(event);
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
