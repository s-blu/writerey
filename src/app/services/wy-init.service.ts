import { DirectoryService } from './directory.service';
import { DocumentService } from './document.service';
import { SnapshotService } from './snapshot.service';
import { MarkerService } from './marker.service';
import { Injectable } from '@angular/core';

import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;

@Injectable({
  providedIn: 'root',
})
export class WyInitService {
  constructor(
    private markerService: MarkerService,
    private snapshotService: SnapshotService,
    private documentService: DocumentService,
    private directoryService: DirectoryService
  ) {}

  init() {
    this.configureClassesForQuill();
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
}

export function initializeApp(appInitService: WyInitService) {
  return (): void => {
    return appInitService.init();
  };
}
