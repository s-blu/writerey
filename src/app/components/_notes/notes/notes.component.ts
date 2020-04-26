import { DEFAULT_CONTEXTS } from '../../../services/context.service';
import { DISTRACTION_FREE_STATES } from 'src/app/models/distractionFreeStates.enum';
import { FADE_ANIMATIONS } from '../../../utils/animation.utils';
import { DistractionFreeStore } from '../../../stores/distractionFree.store';
import { DocumentModeStore } from '../../../stores/documentMode.store';
import { ContextStore } from '../../../stores/context.store';
import { MarkerService } from 'src/app/services/marker.service';
import { DOC_MODES } from '../../../models/docModes.enum';
import { NotesService } from '../../../services/notes.service';
import { ParagraphService } from '../../../services/paragraph.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from '../../../models/note.interface';
import { Subscription } from 'rxjs';
import { FileInfo } from 'src/app/models/fileInfo.interface';
import * as uuid from 'uuid';
import { MarkerStore } from 'src/app/stores/marker.store';
import { DocumentStore } from 'src/app/stores/document.store';
import { ContextService } from 'src/app/services/context.service';

@Component({
  selector: 'wy-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class NotesComponent implements OnInit, OnDestroy {
  MODES = DOC_MODES;
  mode: DOC_MODES;
  noteContexts;
  markerDefinitions;
  parId: string;
  fileInfo: FileInfo;
  notes: any = {
    paragraph: [],
  };
  distractionFreeState: DISTRACTION_FREE_STATES;
  DF_STATES = DISTRACTION_FREE_STATES;

  private subscription = new Subscription();

  constructor(
    private paragraphService: ParagraphService,
    private notesService: NotesService,
    private markerService: MarkerService,
    private contextStore: ContextStore,
    private contextService: ContextService,
    private markerStore: MarkerStore,
    private documentModeStore: DocumentModeStore,
    private documentStore: DocumentStore,
    private distractionFreeStore: DistractionFreeStore
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
      this.distractionFreeStore.distractionFree$.subscribe(status => {
        this.distractionFreeState = status;
      })
    );
    this.subscription.add(this.documentModeStore.mode$.subscribe(mode => (this.mode = mode)));
    this.subscription.add(
      this.documentStore.fileInfo$.subscribe(fileInfo => {
        this.fileInfo = fileInfo;
        this.parId = null;
        this.getContexts();
      })
    );
    this.subscription.add(
      this.documentStore.paragraphId$.subscribe(id => {
        if (id !== this.parId) {
          this.parId = id;
          this.getContexts();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  editNote(editedNote, oldContext?) {
    const context = oldContext || editedNote.context;
    let notes = this.notes[context];
    if (!notes) {
      console.warn('Could not find context collection for note. Do nothing.', editedNote);
      return;
    }
    const index = notes.findIndex(n => n.id === editedNote.id);
    if (index > -1) {
      notes.splice(index, 1, editedNote);
    } else {
      console.warn('Could not find note to edit in context. Do nothing.', editedNote);
      return;
    }
    this.updateParagraphMeta(context, notes);
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
      obs = this.markerService.saveMetaForMarkerValue(context, data, 'notes');
    } else {
      const con = context === 'paragraph' ? this.parId : context;
      obs = this.paragraphService.setParagraphMeta(this.fileInfo.path, this.fileInfo.name, con, 'notes', data);
    }

    obs.subscribe(res => {
      this.notes[context] = res;
    });
  }

  shouldShowNotes(): boolean {
    if (this.distractionFreeState === DISTRACTION_FREE_STATES.FULL) {
      return this.mode === DOC_MODES.REVIEW;
    }
    return this.mode !== DOC_MODES.READ;
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
      this.contextService.getContexts(this.fileInfo.path, this.fileInfo.name, this.parId).subscribe(res => {
        this.updateContexts(res);
      })
    );
  }

  private updateContexts(contexts) {
    this.noteContexts = contexts;
    this.fetchNotesForParagraph();
  }
}
