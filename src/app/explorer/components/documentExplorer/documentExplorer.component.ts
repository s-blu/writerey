// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentStore } from './../../../stores/document.store';

@Component({
  selector: 'wy-document-explorer',
  templateUrl: './documentExplorer.component.html',
  styleUrls: ['./documentExplorer.component.scss'],
})
export class DocumentExplorerComponent implements OnInit {
  @Input() project;

  constructor(private documentStore: DocumentStore, private router: Router) {}

  ngOnInit() {}

  openDocument(node) {
    this.documentStore.setFileInfo({ name: node.name, path: node.path });
    this.router.navigate(['document'], { queryParams: { path: node.path, name: node.name } });
  }
}
