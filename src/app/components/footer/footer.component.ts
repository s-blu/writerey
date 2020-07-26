// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Subscription } from 'rxjs';
import { SnapshotStore } from '../../stores/snapshot.store';
import { Component, OnInit, Input } from '@angular/core';
import { DocumentDefinition } from '../../shared/models/documentDefinition.interface';

@Component({
  selector: 'wy-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }
}
