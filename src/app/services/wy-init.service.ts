// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { DirectoryService } from './directory.service';
import { DocumentService } from './document.service';
import { SnapshotService } from './snapshot.service';
import { LabelService } from './label.service';
import { Injectable } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { retryWhen, delay, mergeMap, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

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
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
    private api: ApiService
  ) {}

  init() {
    this.addWritereyIconToMatIcon();
    this.waitForServerStartup().subscribe(_ => {
      console.log('Server is ready, proceeding with init of frontend ...');
      this.labelService.init();
      this.snapshotService.init();
      this.documentService.init();
      this.directoryService.init();
    });
  }

  private addWritereyIconToMatIcon() {
    this.matIconRegistry.addSvgIcon(
      'writerey',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/writerey.svg')
    );
  }

  private waitForServerStartup() {
    const maxRetries = 4;
    let retries = maxRetries;

    return this.http.get(this.api.getServerReadyRoute()).pipe(
      retryWhen(response =>
        response.pipe(
          tap(_ => console.warn(`Ping was not successfull, server could not be reached. Retry ${retries} of ${maxRetries}.`)),
          delay(1000),
          mergeMap(err => (retries-- > 0 ? of(err) : throwError(err)))
        )
      )
    );
  }
}

export function initializeApp(appInitService: WyInitService) {
  return (): void => {
    return appInitService.init();
  };
}
