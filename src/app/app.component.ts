import { SnapshotService } from './services/snapshot.service';
import { DocumentService } from './services/document.service';
import { ParagraphService } from './services/paragraph.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentDefinition } from './interfaces/documentDefinition.interface';
import { Note } from './interfaces/note.interface';
import { FileInfo } from './interfaces/fileInfo.interface';
import { Subscription } from 'rxjs';
import { DOC_MODES } from './interfaces/docModes.enum';

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
  snapshotDate: Date;
  paragraphId: string;

  isLoading = false;
  activeMode: DOC_MODES = DOC_MODES.WRITE;

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
    this.paragraphId = null;
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
    console.log('on hover app', event);
    this.paragraphId = event;
  }

  onChange(event) {
    console.log('saving on debounce...')
    this.subscription.add(
      this.documentService
        .saveDocument(this.document.path, this.document.name, event)
        .subscribe((res: DocumentDefinition) => {
          console.log('saved. will update document and content')
          this.document = res;
          this.documentContent.content = event;
        }));
  }

  refreshSnapshotDate(event) {
    this.snapshotDate = event;
  }

  switchDocumentMode(mode) {
    if (mode === DOC_MODES.REVIEW) {
      this.activeMode = mode;
      this.isLoading = true;
      this.documentService.enhanceAndSaveDocument(this.document.path, this.document.name, this.documentContent.content).subscribe(res => {
        this.documentContent.content = res.content;
        this.isLoading = false;
      });
    }
  }
}
