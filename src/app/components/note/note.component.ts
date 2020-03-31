import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Note } from '../../interfaces/note.interface';

@Component({
  selector: 'wy-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  @Input() note: Note;

  @Output() deleteNote = new EventEmitter<any>();

  noteStyles = '';
  classes = 'note'

  constructor() { }

  ngOnInit() {
    this.classes += ` type-${this.note.type}`;
    if (this.note.color) {
      this.noteStyles = 'background-color:' + this.note.color;
    }
  }

  delete() {
    this.deleteNote.emit(this.note);
  }
}
