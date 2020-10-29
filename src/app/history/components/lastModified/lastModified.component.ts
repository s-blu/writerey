// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Subscription, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnapshotStore } from 'src/app/stores/snapshot.store';
import { wobbleAnimation } from 'angular-animations';
import { tap, flatMap } from 'rxjs/operators';
import { DocumentStore } from 'src/app/stores/document.store';

@Component({
  selector: 'wy-last-modified',
  templateUrl: './lastModified.component.html',
  styleUrls: ['./lastModified.component.scss'],
  animations: [wobbleAnimation()],
})
export class LastModifiedComponent implements OnInit, OnDestroy {
  lastSnapshot: Date;
  lastSave: Date;
  saved = false;

  private fileInfo;
  private previousLastSave;
  private subscription = new Subscription();
  constructor(private snapshotStore: SnapshotStore, private documentStore: DocumentStore) {}

  ngOnInit() {
    this.subscription.add(this.snapshotStore.snapshotDate$.subscribe(res => (this.lastSnapshot = res)));
    this.subscription.add(
      this.documentStore.lastSaved$
        .pipe(
          tap(res => {
            this.previousLastSave = this.lastSave;
            this.lastSave = res;
          }),
          flatMap(_ => this.documentStore.fileInfo$)
        )
        .subscribe(fileInfo => {
          if (this.previousLastSave === this.lastSave) return;

          if (this.fileInfo !== fileInfo) {
            this.fileInfo = fileInfo;
          } else if (this.previousLastSave) {
            this.saved = !this.saved;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
