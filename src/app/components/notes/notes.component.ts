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
  @Input() isReviewMode: boolean;
  @Input() fileInfo: FileInfo;
  @Input() set paragraphId(pId: string) {
    this.fetchNotesForParagraph(pId);
  }

  noteContexts;
  parId: string;
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
    this.subscription.unsubscribe()
  }

  createNewNote(event) {
    if (!event) return;
    const context = event.context === 'paragraph' ? this.parId : event.context;
    console.log('time to create a new note!', event)
    const newNote: Note = {
      type: 'info',
      context: event.context,
      text: event.text
    }
    // FIXME kaputt.
    if (this.notes && this.notes[event.context]) {
      this.notes[event.context] = [newNote, ...this.notes[event.context]];
    } else {
      if (!this.notes) this.notes = {};
      this.notes[event.context] = [newNote];
    }
    this.paragraphService.setParagraphMeta(this.fileInfo.path, this.fileInfo.name, context, 'notes', this.notes[event.context])
      .subscribe(res => { console.log('createNewNote, got res', res) })
  }

  private fetchNotesForParagraph(pId?) {
    this.notes = {};
    this.noteContexts = [];

    if (!this.fileInfo || !pId) return;
    if (this.parId === pId) return;
    this.parId = pId;
    console.log('fetching notes from server ...')
    this.noteContexts = this.notesService.getContextesForParagraph(this.parId);
    this.subscription.add(this.notesService.getNotesForParagraph(this.fileInfo.path, this.fileInfo.name, pId, this.noteContexts)
      .subscribe(res => {
        try {
          if (res) {
            console.log('got notes!', res)
            this.notes = res;
          }
        } catch (err) {
          console.error('getting notes failed', err);
        }
      }));
  }

}
