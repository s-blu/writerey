import { LabelDefinition } from './../../../models/labelDefinition.class';
import { DISTRACTION_FREE_STATES } from 'src/app/models/distractionFreeStates.enum';
import { FADE_ANIMATIONS } from '../../../utils/animation.utils';
import { DistractionFreeStore } from '../../../stores/distractionFree.store';
import { DocumentModeStore } from '../../../stores/documentMode.store';
import { ContextStore } from '../../../stores/context.store';
import { LabelService } from 'src/app/services/label.service';
import { DOC_MODES } from '../../../models/docModes.enum';
import { NotesService } from '../../../services/notes.service';
import { ParagraphService } from '../../../services/paragraph.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileInfo } from 'src/app/models/fileInfo.interface';
import { LabelStore } from 'src/app/stores/label.store';
import { DocumentStore } from 'src/app/stores/document.store';
import { ContextService } from 'src/app/services/context.service';

@Component({
  selector: 'wy-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class NotesComponent implements OnInit, OnDestroy {
  @Input() set labelDefinition(md: LabelDefinition) {
    this.labelDef = md;
    this.getContexts();
  }

  labelDef: LabelDefinition;
  MODES = DOC_MODES;
  mode: DOC_MODES;
  noteContexts;
  labelDefinitions;
  parId: string;
  fileInfo: FileInfo;
  notes: any = {
    paragraph: [],
  };
  distractionFreeState: DISTRACTION_FREE_STATES;
  DF_STATES = DISTRACTION_FREE_STATES;
  filteredNotes = {};
  filters = {
    todo: {
      available: false,
      isShown: true,
      icon: 'assignment',
    },
    info: {
      available: false,
      isShown: true,
      icon: 'info',
    },
    label: {
      available: false,
      isShown: true,
      icon: 'location_on',
    },
    link: {
      available: false,
      isShown: true,
      icon: 'link',
    },
  };

  private subscription = new Subscription();
  constructor(
    private paragraphService: ParagraphService,
    private notesService: NotesService,
    private labelService: LabelService,
    private contextStore: ContextStore,
    private contextService: ContextService,
    private labelStore: LabelStore,
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
      this.labelStore.labelDefinitions$.subscribe(labelDefs => {
        this.labelDefinitions = labelDefs;
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

  editNotesItem(editedItem, oldContext?) {
    const context = oldContext || editedItem.context;
    const notes = this.notes[context];
    if (!notes) {
      console.warn('Could not find context collection for note. Do nothing.', editedItem);
      return;
    }
    const index = notes.findIndex(n => n.id === editedItem.id);
    if (index > -1) {
      notes.splice(index, 1, editedItem);
    } else {
      console.warn('Could not find note to edit in context. Do nothing.', editedItem);
      return;
    }
    this.updateParagraphMeta(context, notes);
  }

  deleteNotesItem(item) {
    let notes = this.notes[item.context];
    if (!notes) {
      console.warn('Could not find context collection for note. Do nothing.', item);
      return;
    }
    notes = notes.filter(n => n.id !== item.id);
    this.updateParagraphMeta(item.context, notes);
  }

  createNewNote(event) {
    if (!event) return;
    const updatedMetaData = [event];
    if (this.notes && this.notes[event.context]) {
      updatedMetaData.push(...this.notes[event.context]);
    }
    this.updateParagraphMeta(event.context, updatedMetaData);
  }

  private updateParagraphMeta(context, data) {
    let obs;
    if (context.includes(':')) {
      obs = this.labelService.saveMetaForLabelValue(context, data, 'notes');
    } else {
      const con = context === 'paragraph' ? this.parId : context;
      obs = this.paragraphService.setParagraphMeta(this.fileInfo.path, this.fileInfo.name, con, 'notes', data);
    }

    obs.subscribe(res => {
      this.notes[context] = res;
      this.filterNotesForContext(context);
    });
  }

  shouldShowNotes(): boolean {
    if (this.distractionFreeState === DISTRACTION_FREE_STATES.FULL) {
      return this.mode === DOC_MODES.REVIEW;
    }
    return this.mode !== DOC_MODES.READ;
  }

  filterNotes(typeOfNote?) {
    if (typeOfNote) {
      this.filters[typeOfNote].isShown = !this.filters[typeOfNote].isShown;
    }

    this.filteredNotes = {};
    for (const key of Object.keys(this.notes)) {
      this.filterNotesForContext(key);
    }
  }

  private filterNotesForContext(context) {
    if (!this.filteredNotes) this.filteredNotes = {};
    this.filteredNotes[context] = this.notes[context].filter(n => {
      const noteItemType = (n.type || n.stereotype || '').toLowerCase();
      if (this.filters[noteItemType]) {
        this.filters[noteItemType].available = true;
        return this.filters[noteItemType].isShown;
      }
      return true;
    });
  }

  private fetchNotesForParagraph() {
    this.notes = {};
    if (!this.fileInfo && !this.parId) return;

    this.subscription.add(
      this.notesService
        .getNotesForParagraph(this.fileInfo.path, this.fileInfo.name, this.parId, this.noteContexts)
        .subscribe(res => {
          this.notes = res;
          this.filterNotes();
        })
    );
  }

  private fetchNotesForLabelDefinition() {
    this.notes = {};

    this.subscription.add(
      this.notesService.getNotesForLabelDefinition(this.labelDef, this.noteContexts).subscribe(res => {
        this.notes = res;
        this.filterNotes();
      })
    );
  }

  private getContexts() {
    if (!this.fileInfo && !this.labelDef) return;
    let fetchObservable;

    if (this.labelDef) {
      fetchObservable = this.contextService.getContextsForLabelDefinition(this.labelDef);
    } else {
      fetchObservable = this.contextService.getContextsForDocument(this.fileInfo.path, this.fileInfo.name, this.parId);
    }
    this.subscription.add(
      fetchObservable.subscribe(res => {
        this.updateContexts(res);
      })
    );
  }

  private updateContexts(contexts) {
    this.noteContexts = contexts;
    if (this.labelDef) {
      this.fetchNotesForLabelDefinition();
    } else {
      this.fetchNotesForParagraph();
    }
  }
}
