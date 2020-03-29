import { SnapshotService } from './services/snapshot.service';
import { DocumentService } from './services/document.service';
import { ParagraphService } from './services/paragraph.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentDefinition } from './interfaces/documentDefinition.interface';
import { Note } from './interfaces/note.interface';
import { FileInfo } from './interfaces/fileInfo.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'writerey';

  fileInfo: FileInfo;
  document: DocumentDefinition;
  documentContent: { content: string };
  notes: Array<Note>;
  snapshotDate: Date;

  isLoading = false;

  private subscription = new Subscription();

  constructor(private paragraphService: ParagraphService, private documentService: DocumentService, private snapshotService: SnapshotService) { }

  ngOnInit() {
    this.fileInfo = this.documentService.getLastSavedFileInfo();
    if (this.fileInfo) {
      this.changeDoc(this.fileInfo);
    }
    this.subscription.add(this.snapshotService.getSnapshotInfo().subscribe((res: any) => {
      console.log('snapshotInfo received', res);
      if (res.lastCommitDate) {
        try {
          this.snapshotDate = new Date(res.lastCommitDate);
        } finally { }
      }
    })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeDoc(event: FileInfo) {
    console.log('change doc event received', event);
    this.fileInfo = event;
    this.isLoading = true;
    this.subscription.add(this.documentService.getDocument(event.path, event.name).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.documentContent = { content: res.content };
        delete res.content;
        this.document = res;
      }
    }));
  }

  onHover(event) {
    this.subscription.add(this.paragraphService.getParagraphMeta(this.fileInfo.path, this.fileInfo.name, event, 'notes').subscribe(res => {
      try {
        console.log('on hover app', res);
        if (res && res.length) {
          this.notes = res;
        }
      } catch (err) {
        console.log('getting notes failed', err);
      }
    }));
  }

  onChange(event) {
    this.subscription.add(
      this.documentService
        .saveDocument(this.document.path, this.document.name, event)
        .subscribe((res: DocumentDefinition) => {
          this.document = res;
        }));
  }

  refreshSnapshotDate(event) {
    this.snapshotDate = event;
  }
}
