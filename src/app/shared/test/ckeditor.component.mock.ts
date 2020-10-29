import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ckeditor',
  template: '<div>mock ckeditor</div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockCkeditorComponent),
      multi: true,
    },
  ],
})
export class MockCkeditorComponent implements ControlValueAccessor {
  @Input() editor;
  @Input() config;
  @Output() ready = new EventEmitter();
  // tslint:disable-next-line: no-output-native
  @Output() change = new EventEmitter();

  /**
   * MockComponent needs to implement ControlValueAccessor interface if used in a formBuilder
   * meaning if given a [formControl] or [(ngModel)] binding
   */
  @Input() disabled = false;

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
