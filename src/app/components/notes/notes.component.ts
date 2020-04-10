import { MarkerService } from 'src/app/services/marker.service';
import { DOC_MODES } from '../../models/docModes.enum';
import { NotesService } from './../../services/notes.service';
import { ParagraphService } from './../../services/paragraph.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Note } from '../../models/note.interface';
import { Subscription } from 'rxjs';
import { FileInfo } from 'src/app/models/fileInfo.interface';
import * as uuid from 'uuid';
import { map, flatMap, mergeMap } from 'rxjs/operators';

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
  markerDefinitions;
  parId: string;
  fileInfo: FileInfo;
  notes: any = {
    paragraph: [],
  };

  private subscription = new Subscription();

  constructor(
    private paragraphService: ParagraphService,
    private notesService: NotesService,
    private markerService: MarkerService
  ) {}

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
    let obs;
    if (context.includes(':')) {
      obs = this.markerService.saveNotesForMarkerValue(context, data);
    } else {
      const con = context === 'paragraph' ? this.parId : context;
      obs = this.paragraphService.setParagraphMeta(this.fileInfo.path, this.fileInfo.name, con, 'notes', data);
    }

    obs.subscribe(res => {
      this.notes[context] = res;
    });
  }

  private fetchNotesForParagraph(pId?) {
    this.notes = {};
    this.noteContexts = [];

    if (!this.fileInfo && !pId) return;
    if (pId && this.parId === pId) return;
    this.parId = pId;

    this.subscription.add(
      this.notesService
        .getContextes(this.fileInfo.path, this.fileInfo.name, this.parId)
        .pipe(
          mergeMap(res => {
            this.noteContexts = res;
            // sort reversed alphabetically to have paragraph > document > markers
            if (res && res instanceof Array) this.noteContexts.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
            return this.markerService.getMarkerDefinitions();
          }),
          mergeMap(markerDefs => {
            this.markerDefinitions = markerDefs;
            return this.notesService.getNotesForParagraph(
              this.fileInfo.path,
              this.fileInfo.name,
              pId,
              this.noteContexts
            );
          })
        )
        .subscribe(res => (this.notes = res))
    );
  }
}
