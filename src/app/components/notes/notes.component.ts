import { DocumentModeStore } from './../../stores/documentMode.store';
import { ContextStore } from './../../stores/context.store';
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
import { MarkerStore } from 'src/app/stores/marker.store';
import { DocumentStore } from 'src/app/stores/document.store';

@Component({
  selector: 'wy-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit, OnDestroy {
  @Input() set paragraphId(pId: string) {
    this.parId = pId;
    this.getContexts();
  }

  MODES = DOC_MODES;
  mode: DOC_MODES;
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
    private markerService: MarkerService,
    private contextStore: ContextStore,
    private markerStore: MarkerStore,
    private documentModeStore: DocumentModeStore,
    private documentStore: DocumentStore
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.contextStore.contexts$.subscribe(contexts => {
        this.updateContexts(contexts);
      })
    );
    this.subscription.add(
      this.markerStore.markerDefinitions$.subscribe(markerDefs => {
        this.markerDefinitions = markerDefs;
      })
    );
    this.subscription.add(
      this.documentModeStore.mode$.subscribe((mode) => this.mode = mode)
    );
    this.subscription.add(
      this.documentStore.fileInfo$.subscribe((fileInfo) => {
        this.fileInfo = fileInfo;
        this.parId = null;
        this.getContexts();
      })
    );
  }

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

  private fetchNotesForParagraph() {
    this.notes = {};
    if (!this.fileInfo && !this.parId) return;

    this.subscription.add(
      this.notesService
        .getNotesForParagraph(this.fileInfo.path, this.fileInfo.name, this.parId, this.noteContexts)
        .subscribe(res => (this.notes = res))
    );
  }

  private getContexts() {
    if (!this.fileInfo) return;
    this.subscription.add(
      this.notesService.getContextes(this.fileInfo.path, this.fileInfo.name, this.parId).subscribe(res => {
        this.updateContexts(res);
      })
    );
  }

  private updateContexts(contexts) {
    this.noteContexts = contexts;
    // sort reversed alphabetically to have paragraph > document > markers
    if (contexts && contexts instanceof Array) this.noteContexts.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    this.fetchNotesForParagraph();
  }
}
