import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LabelDefinition } from '@writerey/shared/models/labelDefinition.class';
import { Map } from 'immutable';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { ContextService } from 'src/app/services/context.service';
import { LabelService } from 'src/app/services/label.service';
import { NotesService } from 'src/app/services/notes.service';
import { LabelStore } from 'src/app/stores/label.store';

@Component({
  selector: 'wy-label-note-items',
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.route.queryParams
        .pipe(
          distinctUntilChanged(),
          mergeMap(params => this.labelService.getLabelDefinition(params.id))
        )
        .subscribe(labelDef => {
          if (!labelDef) return;
          this.labelDef = labelDef;
          this.getContexts();
        })
    );
    this.subscription.add(
      this.labelStore.labelDefinitions$.subscribe(labelDefs => {
        this.labelDefinitions = labelDefs;
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
    this.labelService.saveMetaForLabelValue(context, data).subscribe(res => {
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
