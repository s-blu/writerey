/**
 * Copyright (c) 2021 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wy-note-item-color-chooser',
  templateUrl: './noteItemColorChooser.component.html',
  styleUrls: ['./noteItemColorChooser.component.scss'],
})
export class NoteItemColorChooserComponent implements OnInit {
  @Output() colorChanged = new EventEmitter<string>();

  color: string;
  constructor() {}

  ngOnInit() {}

  changeColor() {
    if (this.color) {
      this.colorChanged.emit(this.color);
    } else {
      this.colorChanged.emit(null);
    }
  }
}
