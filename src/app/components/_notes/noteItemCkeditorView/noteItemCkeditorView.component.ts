// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';

@Component({
  selector: 'wy-note-item-ckeditor-view',
  templateUrl: './noteItemCkeditorView.component.html',
  styleUrls: ['./noteItemCkeditorView.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NoteItemCkeditorViewComponent implements OnInit {
  @Input() data: string;

  Editor = DecoupledEditor;
  constructor() {}

  ngOnInit() {}
}
