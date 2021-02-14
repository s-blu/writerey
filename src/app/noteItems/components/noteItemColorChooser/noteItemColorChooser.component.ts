/**
 * Copyright (c) 2021 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'wy-note-item-color-chooser',
  templateUrl: './noteItemColorChooser.component.html',
  styleUrls: ['./noteItemColorChooser.component.scss'],
})
export class NoteItemColorChooserComponent {
  @Input() set initialColor(c) {
    this.activeColor = c || null;
  }
  @Output() colorChanged = new EventEmitter<string>();

  activeColor: string;
  colors = [
    '#FEF3C3', // yellow
    '#ffd4a0', // orange
    '#FCBDB5', // red
    '#E9D3F3', // violett
    '#c5e2ff', // blue
    '#C0F8CE', // green
    '#dbe2e2', // grey
  ];

  changeColor(newColor) {
    if (this.activeColor !== newColor) {
      this.activeColor = newColor;
      this.colorChanged.emit(newColor);
    }
  }
}
