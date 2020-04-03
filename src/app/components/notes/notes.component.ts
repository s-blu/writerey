import { DOC_MODES } from '../../models/docModes.enum';
import { NotesService } from './../../services/notes.service';
import { ParagraphService } from './../../services/paragraph.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Note } from '../../models/note.interface';
import { Subscription } from 'rxjs';
import { FileInfo } from 'src/app/models/fileInfo.interface';
import * as uuid from 'uuid';

@Component({
  selector: 'wy-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit, OnDestroy {
  @Input() mode: DOC_MODES;
  @Input() set file(info: FileInfo) {
    this.fileInfo = info;
    this.fetchNotesForParagraph();
  }
  @Input() set paragraphId(pId: string) {
    this.fetchNotesForParagraph(pId);
  }

  MODES = DOC_MODES;
  noteContexts;
  parId: string;
  fileInfo: FileInfo;
  notes: any = {
    paragraph: [],
  };
  private subscription = new Subscription();

  constructor(private paragraphService: ParagraphService, private notesService: NotesService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteNote(note) {
    let notes = this.notes[note.context];
    if (!notes) {
      console.warn('Could not find context collection for note. Do nothing.', note);
      return;
    }
    notes = notes.filter(n => n.id !== note.id);
    console.log('filtered out note', notes);
    this.updateParagraphMeta(note.context, notes);
  }

  createNewNote(event) {
    if (!event) return;
    const newNote: Note = {
      id: uuid.v4(),
      type: event.type,
      color: event.color,
      context: event.context,
      text: event.text,
    };
    const updatedMetaData = [newNote];
    if (this.notes && this.notes[event.context]) {
      updatedMetaData.push(...this.notes[event.context]);
    }
    this.updateParagraphMeta(event.context, updatedMetaData);
  }

  private updateParagraphMeta(context, data) {
    const con = context === 'paragraph' ? this.parId : context;
    this.paragraphService
      .setParagraphMeta(this.fileInfo.path, this.fileInfo.name, con, 'notes', data)
      .subscribe(res => {
        this.notes[context] = res;
      });
  }

  private fetchNotesForParagraph(pId?) {
    this.notes = {};
    this.noteContexts = [];

    if (!this.fileInfo && !pId) return;
    if (pId && this.parId === pId) return;
    this.parId = pId;

    this.noteContexts = this.notesService.getContextesForParagraph(this.parId);
    this.subscription.add(
      this.notesService
        .getNotesForParagraph(this.fileInfo.path, this.fileInfo.name, pId, this.noteContexts)
        .subscribe(res => {
          try {
            if (res) {
              this.notes = res;
            }
          } catch (err) {
            console.error('getting notes failed', err);
          }
        })
    );
  }
}
