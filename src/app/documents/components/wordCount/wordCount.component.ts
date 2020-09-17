// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DocumentStore } from 'src/app/stores/document.store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-word-count',
  templateUrl: './wordCount.component.html',
  styleUrls: ['./wordCount.component.scss'],
})
export class WordCountComponent implements OnInit, OnDestroy {
  wordCount: number;

  private subscription = new Subscription();
  constructor(private documentStore: DocumentStore) {}

  ngOnInit() {
    this.subscription.add(
      this.documentStore.wordCount$.subscribe(res => {
        this.wordCount = res;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
