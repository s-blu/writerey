// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DocumentStore } from './../../../stores/document.store';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wy-document-explorer',
  templateUrl: './documentExplorer.component.html',
  styleUrls: ['./documentExplorer.component.scss'],
})
export class DocumentExplorerComponent implements OnInit {
  @Input() project;

  constructor(private documentStore: DocumentStore) {}

  ngOnInit() {}

  openDocument(node) {
    this.documentStore.setFileInfo({ name: node.name, path: node.path });
  }
}
