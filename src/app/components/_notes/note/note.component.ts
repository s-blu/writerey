import { FADE_ANIMATIONS } from '../../../utils/animation.utils';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Note } from '../../../models/notesItems.interface';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { rotateAnimation } from 'angular-animations';
import { getReadableNameForMarkerContext } from 'src/app/utils/marker.utils';

@Component({
  selector: 'wy-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  animations: [...FADE_ANIMATIONS, rotateAnimation()],
})
export class NoteComponent implements OnInit {
  @Input() note: Note;
  @Input() markerDefs: Array<MarkerDefinition>;

  @Output() deleteNote = new EventEmitter<any>();
  @Output() editNote = new EventEmitter<any>();

  noteStyles = '';
  classes = 'note';
  contextName = '';
  isExpanded = false;

  constructor() {}

  ngOnInit() {
    this.classes += ` type-${this.note.type}`;
    this.isExpanded = !!this.note.keepOpen;
    if (this.note.color) {
      this.noteStyles = 'background-color:' + this.note.color;
    }

    if (this.note.context.includes(':')) {
      this.contextName = getReadableNameForMarkerContext(this.note.context, this.markerDefs);
    } else {
      this.contextName = this.note.context;
    }
  }

  delete() {
    this.deleteNote.emit(this.note);
  }

  changeKeepOpen() {
    this.note.keepOpen = !this.note.keepOpen;
    this.editNote.emit(this.note);
  }

  changeExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
