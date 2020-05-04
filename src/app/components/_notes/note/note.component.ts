import { FADE_ANIMATIONS } from '../../../utils/animation.utils';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Note } from '../../../models/notesItems.interface';
import { LabelDefinition } from 'src/app/models/labelDefinition.class';
import { rotateAnimation } from 'angular-animations';
import { getReadableNameForLabelContext } from 'src/app/utils/label.utils';

@Component({
  selector: 'wy-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  animations: [...FADE_ANIMATIONS, rotateAnimation()],
})
export class NoteComponent implements OnInit {
  @Input() note: Note;
  @Input() labelDefs: Array<LabelDefinition>;

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
      this.contextName = getReadableNameForLabelContext(this.note.context, this.labelDefs);
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
