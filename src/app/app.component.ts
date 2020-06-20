// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DocumentModeStore } from './stores/documentMode.store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DOC_MODES } from './models/docModes.enum';
import { LabelDefinition } from './models/labelDefinition.class';
import { DocumentStore } from './stores/document.store';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'writerey';

  labelDef: LabelDefinition;
  isLoading = false;

  private subscription = new Subscription();

  constructor(private documentStore: DocumentStore, private documentModeStore: DocumentModeStore) {}

  ngOnInit() {
    this.subscription.add(this.documentStore.fileInfo$.subscribe(() => (this.labelDef = null)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // FIXME replace this special handling with proper routing to decide which page to show
  changeLabel(event: LabelDefinition) {
    this.documentModeStore.setMode(DOC_MODES.WRITE);
    this.labelDef = event;
  }
}
