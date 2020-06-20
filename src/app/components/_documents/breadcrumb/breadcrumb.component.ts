// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FileInfo } from 'src/app/models/fileInfo.interface';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DocumentStore } from 'src/app/stores/document.store';

@Component({
  selector: 'wy-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnChanges {
  @Input() fileInfo?: FileInfo;
  @Input() skipRoot?: boolean;
  path: Array<string> = [];
  name = '';

  constructor(private documentStore: DocumentStore) {}

  ngOnInit() {
    if (!this.fileInfo) {
      this.documentStore.document$.subscribe(fileInfo => {
        this.setPathAndName(fileInfo);
      });
    } else {
      this.setPathAndName(this.fileInfo);
    }
  }

  ngOnChanges() {
    if (this.fileInfo) {
      this.setPathAndName(this.fileInfo);
    }
  }

  private setPathAndName(fileInfo) {
    if (!fileInfo) return;
    const pathParts = (fileInfo.path || '').split('/').filter(el => el && el !== '');
    if (this.skipRoot) {
      pathParts.shift();
    }
    this.path = pathParts;
    this.name = fileInfo?.name || '';
  }
}
