// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { NoteItemStereotypes } from '../../../shared/models/notesItems.interface';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-notes-item',
  templateUrl: './notesItem.component.html',
  styleUrls: ['./notesItem.component.scss'],
})
export class NotesItemComponent implements OnInit {
  @Input() item;
  @Input() labelDefs;
  @Input() labelMode: boolean;
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  stereotypes = NoteItemStereotypes;

  constructor() {}

  ngOnInit() {}

  onEdit(item) {
    if (!item) return;
    this.editItem.emit(item);
  }

  onDelete(item) {
    if (!item) return;
    this.deleteItem.emit(item);
  }
}
