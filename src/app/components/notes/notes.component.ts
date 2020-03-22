import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';

@Component({
  selector: 'wy-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  @Input() notes: Array<Note>;

  constructor() { }

  ngOnInit() {
  }

}
