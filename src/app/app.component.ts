import { DocumentDefinition } from './interfaces/documentDefinition.interface';
import { SnapshotService } from './services/snapshot.service';
import { DocumentService } from './services/document.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  snapshotDate: Date;
  paragraphId: string;

  isLoading = false;
  activeMode: DOC_MODES = DOC_MODES.WRITE;

  private subscription = new Subscription();

  constructor(private documentService: DocumentService, private snapshotService: SnapshotService) { }

  ngOnInit() {
    this.fileInfo = this.documentService.getLastSavedFileInfo();
    if (this.fileInfo) {
      this.changeDoc(this.fileInfo);
    }
    this.subscription.add(this.snapshotService.getSnapshotInfo().subscribe((res: any) => {
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
    this.fileInfo = event;
  }

  documentChanged(event: DocumentDefinition) {
    this.document = event;
  }

  onEditorClick(event) {
    this.paragraphId = event;
  }

  refreshSnapshotDate(event) {
    this.snapshotDate = event;
  }

  switchDocumentMode(mode) {
    this.activeMode = mode;
  }
}
