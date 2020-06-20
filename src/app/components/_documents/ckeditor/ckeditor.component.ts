// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DocumentDefinition } from './../../../models/documentDefinition.interface';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as CkEditorDecoubled from 'src/assets/ckeditor5/build/ckeditor';
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
  @Input() set document(df: DocumentDefinition) {
    if (!df) return;
    if (!this.editor || this.documentDef?.name !== df.name || this.documentDef?.path !== df.path) {
      this.documentDef = df;
      this.setupEditor(df);
    }
  }

  @Output() editorBlur: EventEmitter<any> = new EventEmitter();
  @Output() editorChange: EventEmitter<any> = new EventEmitter();
  @Output() editorClicked: EventEmitter<any> = new EventEmitter();

  private documentDef: DocumentDefinition;
  private editorData: string;
  public editor: CkEditorDecoubled;
  public config = {
    toolbar: {
      items: [
        'heading',
        'alignment',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'numberedList',
        'bulletedList',
        'indent',
        'outdent',
        '|',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'link',
        'blockQuote',
        'imageUpload',
        'insertTable',
        '|',
        'removeFormat',
        'undo',
        'redo',
      ],
    },
    language: 'en',
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
    },
    table: {
      contentToolbar: ['tableProperties', 'tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties'],
    },
    simpleUpload: {},
    extraPlugins: [AllowClassesOnP],
  };

  private changeDebounce = new Subject();
  private subscription = new Subscription();
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.subscription.add(
      this.changeDebounce.pipe(distinctUntilChanged(), debounceTime(1000)).subscribe(async (event: any) => {
        this.sendChangeEvent(event);
      })
    );
  }

  async setupEditor(doc) {
    if (this.editor) {
      await this.destroyEditor();
    }

    this.config.simpleUpload = {
      // The URL that the images are uploaded to.
      uploadUrl: this.apiService.getImagetRoute(doc.name),

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        docpath: doc.path,
      },
    };
    CkEditorDecoubled.create(document.querySelector('#ckeditor-container'), this.config)
      .then(editor => {
        editor.setData(this.editorData);
        editor.model.document.on('change:data', ev => {
          this.changeDebounce.next(ev);
        });
        editor.editing.view.document.on('blur', ev => {
          this.onBlur(ev);
        });

        const toolbarContainer = document.querySelector('#ckeditor-toolbar-container');
        if (toolbarContainer) toolbarContainer.appendChild(editor.ui.view.toolbar.element);

        this.editor = editor;
      })
      .catch(error => {
        console.error(error);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroyEditor();
  }

  destroyEditor() {
    const toolbarContainer = document.querySelector('#ckeditor-toolbar-container');
    if (toolbarContainer) {
      try {
        toolbarContainer.removeChild(this.editor.ui.view.toolbar.element);
      } catch (e) {
        console.warn('Could not remove editor toolbar on destroy', e);
      }
    }
    return this.editor
      .destroy()
      .then(_ => (this.editor = null))
      .catch(error => {
        console.warn('destroying editor failed', error);
      });
  }

  onBlur(editorEvent) {
    const event = this.getDocumentChangedEvent();
    this.editorBlur.emit(event);
  }

  onChange(event) {
    this.changeDebounce.next(event);
  }

  onEditorClick(event) {
    const className = event?.srcElement?.className || event?.srcElement?.parentNode?.className;
    this.editorClicked.emit(className);
  }

  private sendChangeEvent(editorEvent) {
    const event = this.getDocumentChangedEvent();
    this.editorChange.emit(event);
  }

  private getDocumentChangedEvent() {
    const event: any = {};
    event.document = this.documentDef;
    event.content = this.editor.getData();
    event.plainContent = this.editor.sourceElement.innerText;
    return event;
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
