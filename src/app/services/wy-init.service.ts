import { DirectoryService } from './directory.service';
import { DocumentService } from './document.service';
import { SnapshotService } from './snapshot.service';
import { MarkerService } from './marker.service';
import { Injectable } from '@angular/core';

import * as QuillNamespace from 'quill';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
const Quill: any = QuillNamespace;

@Injectable({
  providedIn: 'root',
})
export class WyInitService {
  constructor(
    private markerService: MarkerService,
    private snapshotService: SnapshotService,
    private documentService: DocumentService,
    private directoryService: DirectoryService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  init() {
    this.configureClassesForQuill();
    this.addWritereyIconToMatIcon();
    this.markerService.init();
    this.snapshotService.init();
    this.documentService.init();
    this.directoryService.init();
  }

  private configureClassesForQuill() {
    const Parchment = Quill.import('parchment');
    const allowClasses = new Parchment.Attributor.Attribute('class', 'class');
    Parchment.register(allowClasses);
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
