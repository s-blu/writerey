import { NoteItemStereotypes } from './../../../models/notesItems.interface';
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
