/**
 * Copyright (c) 2020 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';
import { Component, ViewEncapsulation, AfterViewInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'wy-ckeditor-readonly',
  templateUrl: './ckeditorReadonly.component.html',
  styleUrls: ['./ckeditorReadonly.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CkeditorReadonlyComponent implements AfterViewInit, OnDestroy {
  @Input() data: string;

  @ViewChild('ckContainer') container: ElementRef;

  public editor: DecoupledEditor;

  config = {
    disabled: true,
  };
  constructor() {}

  ngAfterViewInit() {
    DecoupledEditor.create(this.container.nativeElement, this.config)
      .then(editor => {
        editor.setData(this.data || 'mh this seems broken');

        this.editor = editor;
      })
      .catch(error => {
        console.error(error);
      });
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor
        .destroy()
        .then(_ => (this.editor = null))
        .catch(error => {
          console.warn('destroying readonly editor failed', error);
        });
    }
  }
}
