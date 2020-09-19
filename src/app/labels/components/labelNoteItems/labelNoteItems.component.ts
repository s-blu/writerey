import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabelDefinition } from '@writerey/shared/models/labelDefinition.class';
import { Subscription } from 'rxjs';
import { Map } from 'immutable';
import { ContextService } from 'src/app/services/context.service';
import { LabelService } from 'src/app/services/label.service';
import { NotesService } from 'src/app/services/notes.service';
import { ContextStore } from 'src/app/stores/context.store';
import { LabelStore } from 'src/app/stores/label.store';

@Component({
  selector: 'wy-labelNoteItems',
  templateUrl: './labelNoteItems.component.html',
  styleUrls: ['./labelNoteItems.component.scss'],
})
export class LabelNoteItemsComponent implements OnInit, OnDestroy {
  labelDef: LabelDefinition;
  noteContexts;
  labelDefinitions;
  notes;

  private subscription = new Subscription();
  constructor(
    private notesService: NotesService,
    private labelService: LabelService,
    private contextService: ContextService,
    private labelStore: LabelStore,
    private contextStore: ContextStore
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.labelStore.labelDefinitions$.subscribe(labelDefs => {
        this.labelDefinitions = labelDefs;
      })
    );
    this.subscription.add(
      this.contextStore.contexts$.subscribe(newContexts => {
        if (!newContexts) return;
        this.updateContexts(newContexts);
      })
    );
    this.subscription.add(
      this.labelStore.labelDefinition$.subscribe(labelDef => {
        this.labelDef = labelDef;
        this.getContexts();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateNoteItems(event) {
    this.updateParagraphMeta(event.context, event.notes);
  }

  private updateParagraphMeta(context, data) {
    this.labelService.saveMetaForLabelValue(context, data, 'notes').subscribe(res => {
      this.notes[context] = res;
      this.notes = Map(this.notes).toObject();
    });
  }

  private fetchNotesForLabelDefinition() {
    this.notes = {};

    this.subscription.add(
      this.notesService.getNotesForLabelDefinition(this.labelDef, this.noteContexts).subscribe(res => {
        this.notes = res;
      })
    );
  }

  private getContexts() {
    if (!this.labelDef) return;

    this.subscription.add(
      this.contextService.getContextsForLabelDefinition(this.labelDef).subscribe(res => {
        this.updateContexts(res);
      })
    );
  }

  private updateContexts(contexts) {
    this.noteContexts = contexts;
    this.fetchNotesForLabelDefinition();
  }
}
