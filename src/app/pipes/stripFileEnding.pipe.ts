// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripFileEnding',
})
export class StripFileEndingPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.replace(/\.[^\./s]+$/, '');
  }
}
