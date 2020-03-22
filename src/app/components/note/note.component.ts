import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';

@Component({
  selector: 'wy-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  @Input() note: Note;

  typeIcon = 'info';
  noteStyles = '';

  constructor() { }

  ngOnInit() {

    if (this.note.color) {
      this.noteStyles = 'background-color:' + this.note.color;
    }
  }
}
