import { DocumentDefinition } from './models/documentDefinition.interface';
import { SnapshotService } from './services/snapshot.service';
import { DocumentService } from './services/document.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileInfo } from './models/fileInfo.interface';
import { Subscription } from 'rxjs';
import { DOC_MODES } from './models/docModes.enum';
import { MarkerDefinition } from './models/markerDefinition.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'writerey';

  fileInfo: FileInfo;
  markerDef: any; // FIXME
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
    this.resetLoadedData()
    this.fileInfo = event;
  }

  changeMarker(event: MarkerDefinition) {
    this.resetLoadedData();
    this.markerDef = event;
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

  private resetLoadedData() {
    this.markerDef = null;
    this.document = null;
    this.fileInfo = null;
  }
}
