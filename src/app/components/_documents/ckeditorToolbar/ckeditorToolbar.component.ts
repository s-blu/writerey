// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FADE_ANIMATIONS } from '../../../shared/utils/animation.utils';
import { DocumentModeStore } from './../../../stores/documentMode.store';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DOC_MODES } from 'src/app/shared/models/docModes.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-ckeditor-toolbar',
  templateUrl: './ckeditorToolbar.component.html',
  styleUrls: ['./ckeditorToolbar.component.scss'],
  animations: FADE_ANIMATIONS,
  encapsulation: ViewEncapsulation.None,
})
export class CkeditorToolbarComponent implements OnInit, OnDestroy {
  public readonly = false;

  private subscription = new Subscription();
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(private documentModeStore: DocumentModeStore) {}

  ngOnInit() {
    this.subscription.add(
      this.documentModeStore.mode$.subscribe(mode => {
        this.readonly = mode === DOC_MODES.READ;
      })
    );
  }
}
