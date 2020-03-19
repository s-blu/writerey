import { Component, OnInit } from '@angular/core';
import { Note } from '../interfaces/note.interface';

@Component({
  selector: 'wy-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {


  notes: Array<Note> = [{
    type: 'info',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    context: 'Paragraph'
  },
  {
    type: 'info',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy .',
    context: 'Paragraph'
  },
  {
    type: 'info',
    color: '#FFE8B6',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    context: 'Paragraph'
  },
  {
    type: 'info',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    context: 'Paragraph'
  }]

  constructor() { }

  ngOnInit() {
  }

}
