import { DirectoryService } from './directory.service';
import { DocumentService } from './document.service';
import { SnapshotService } from './snapshot.service';
import { LabelService } from './label.service';
import { Injectable } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class WyInitService {
  constructor(
    private labelService: LabelService,
    private snapshotService: SnapshotService,
    private documentService: DocumentService,
    private directoryService: DirectoryService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  init() {
    this.addWritereyIconToMatIcon();
    this.labelService.init();
    this.snapshotService.init();
    this.documentService.init();
    this.directoryService.init();
  }

  private addWritereyIconToMatIcon() {
    this.matIconRegistry.addSvgIcon(
      'writerey',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/writerey.svg')
    );
  }
}

export function initializeApp(appInitService: WyInitService) {
  return (): void => {
    return appInitService.init();
  };
}
