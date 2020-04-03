import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[wyCheckForNameSafety]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CheckForNameSafetyDirective, multi: true }],
})
export class CheckForNameSafetyDirective implements Validator {
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
