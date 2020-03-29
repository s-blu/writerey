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
    if (!this.fileInfo || !pId) return;
    if (this.parId === pId) return;
    this.parId = pId;
    this.noteContexts = this.paragraphService.getContextesForParagraph(this.parId);

    this.subscription.add(this.paragraphService.getParagraphMeta(this.fileInfo.path, this.fileInfo.name, pId, 'notes').subscribe(res => {
      try {
        if (res && res.length) {
          this.notes = res;
        }
      } catch (err) {
        console.error('getting notes failed', err);
      }
    }));
  }

  noteContexts;
  parId: string;
  notes: Array<Note>;
  private subscription = new Subscription();

  constructor(
    private paragraphService: ParagraphService
  ) { }

  ngOnInit() {
    this.noteContexts = this.paragraphService.getContextesForParagraph(this.parId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  createNewNote(event) {
    console.log('time to create a new note!', event)
  }
}
