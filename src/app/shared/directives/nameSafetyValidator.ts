// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NameSafetyValidator(typeToCheck = 'explorer') {
  const nameValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const forbidden = regex.test(control.value);
    return forbidden ? { forbiddenName: true } : null;
  };

  const forbiddenCharatersRe = {
    explorer: /([/\\<>\*\?:\'"])+/,
    tag: /([\s\.~\^:\?\*\[@\\])+/,
  };
  const regex = forbiddenCharatersRe[typeToCheck];
  return regex ? nameValidator : null;
}
