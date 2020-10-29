// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import * as uuid from 'uuid';

interface LabelValue {
  id: string;
  name: string;
}
export class LabelDefinition {
  id: string;
  name: string;
  index: number;
  values: Array<LabelValue>;
  start: number;
  end: number;
  interval: number;
  template: string;

  constructor(name: string) {
    this.id = uuid.v4();
    this.name = name;
    this.values = [];
  }
}
