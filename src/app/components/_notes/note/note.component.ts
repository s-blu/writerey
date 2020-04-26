import { FADE_ANIMATIONS } from '../../../utils/animation.utils';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Note } from '../../../models/note.interface';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { rotateAnimation } from 'angular-animations';

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

  noteStyles = '';
  classes = 'note';
  contextName = '';
  isExpanded = false;

  constructor() {}

  ngOnInit() {
    this.classes += ` type-${this.note.type}`;
    if (this.note.color) {
      this.noteStyles = 'background-color:' + this.note.color;
    }

    if (this.note.context.includes(':')) {
      const [markerId, valueId] = this.note.context.split(':');
      const markerDef = this.markerDefs.find(m => m.id === markerId);
      const valueName = markerDef?.values?.find(v => v.id === valueId)?.name;
      this.contextName = `[${markerDef?.name}] ${valueName}`;
    } else {
      this.contextName = this.note.context;
    }
  }

  delete() {
    this.deleteNote.emit(this.note);
  }

  changeExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
