import { DOC_MODES } from './../../interfaces/docModes.enum';
import { NotesService } from './../../services/notes.service';
import { DocumentDefinition } from './../../interfaces/documentDefinition.interface';
import { ParagraphService } from './../../services/paragraph.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { Subscription } from 'rxjs';
import { FileInfo } from 'src/app/interfaces/fileInfo.interface';

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
    paragraph: []
  };
  private subscription = new Subscription();

  constructor(
    private paragraphService: ParagraphService,
    private notesService: NotesService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createNewNote(event) {
    if (!event) return;
    const context = event.context === 'paragraph' ? this.parId : event.context;
    const newNote: Note = {
      type: event.type,
      color: event.color,
      context: event.context,
      text: event.text
    }
    const newContext = [newNote];
    if (this.notes && this.notes[event.context]) {
      newContext.push(...this.notes[event.context])
    }
    this.paragraphService.setParagraphMeta(this.fileInfo.path, this.fileInfo.name, context, 'notes', newContext)
      .subscribe(res => {
        this.notes[event.context] = res;
      });
  }

  private fetchNotesForParagraph(pId?) {
    this.notes = {};
    this.noteContexts = [];

    if (!this.fileInfo && !pId) return;
    if (pId && this.parId === pId) return;
    this.parId = pId;

    this.noteContexts = this.notesService.getContextesForParagraph(this.parId);
    this.subscription.add(this.notesService.getNotesForParagraph(this.fileInfo.path, this.fileInfo.name, pId, this.noteContexts)
      .subscribe(res => {
        try {
          if (res) {
            this.notes = res;
          }
        } catch (err) {
          console.error('getting notes failed', err);
        }
      }));
  }

}
