import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileInfo } from '@writerey/shared/models/fileInfo.interface';
import { Map } from 'immutable';
import { Subscription } from 'rxjs';
import { ContextService } from 'src/app/services/context.service';
import { LabelService } from 'src/app/services/label.service';
import { NotesService } from 'src/app/services/notes.service';
import { ParagraphService } from 'src/app/services/paragraph.service';
import { DocumentStore } from 'src/app/stores/document.store';

@Component({
  selector: 'wy-document-note-items',
  templateUrl: './documentNoteItems.component.html',
  styleUrls: ['./documentNoteItems.component.scss'],
})
export class DocumentNoteItemsComponent implements OnInit, OnDestroy {
  noteContexts;
  parId: string;
  fileInfo: FileInfo;
  notes;

  private subscription = new Subscription();
  constructor(
    private paragraphService: ParagraphService,
    private notesService: NotesService,
    private labelService: LabelService,
    private contextService: ContextService,
    private documentStore: DocumentStore
  ) {}

  ngOnInit() {
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

  updateNoteItems(event) {
    this.updateParagraphMeta(event.context, event.notes);
  }

  private updateParagraphMeta(context, data) {
    let obs;
    if (context.includes(':')) {
      obs = this.labelService.saveMetaForLabelValue(context, data);
    } else {
      const con = context === 'paragraph' ? this.parId : context;
      obs = this.paragraphService.setParagraphMeta(this.fileInfo.path, this.fileInfo.name, con, 'notes', data);
    }

    obs.subscribe(res => {
      this.notes[context] = res;
      this.notes = Map(this.notes).toObject();
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
        })
    );
  }

  private getContexts() {
    if (!this.fileInfo) return;
    this.subscription.add(
      this.contextService.getContextsForDocument(this.fileInfo.path, this.fileInfo.name, this.parId).subscribe(res => {
        this.updateContexts(res);
      })
    );
  }

  private updateContexts(contexts) {
    this.noteContexts = contexts;
    this.fetchNotesForParagraph();
  }
}
