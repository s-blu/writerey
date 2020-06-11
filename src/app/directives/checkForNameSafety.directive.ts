// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[wyCheckForNameSafety]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CheckForNameSafetyDirective, multi: true }],
})
export class CheckForNameSafetyDirective implements Validator {
  // FIXME: I AM BROKEN

  @Input('wyCheckForNameSafety') typeOfName: 'tag' | 'explorer';

  private forbiddenCharatersRe = {
    explorer: /([/\\<>\*\?:\'"])*/,
    tag: /([\s\.~\^:\?\*\[@\\])*/,
  };

  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    const regex = this.forbiddenCharatersRe[this.typeOfName];
    return regex ? this.nameValidator(regex)(control) : null;
  }

  nameValidator(regex): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = regex.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }
}
