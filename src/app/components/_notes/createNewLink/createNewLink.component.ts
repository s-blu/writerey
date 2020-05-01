import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'wy-create-new-link',
  templateUrl: './createNewLink.component.html',
  styleUrls: ['./createNewLink.component.scss'],
})
export class CreateNewLinkComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() contextNames: any = {};
  @Input() quillConfig: { modules; styles };
  @Output() linkCreated = new EventEmitter<any>();

  createNewForm;
  maxLength = 100;
  currentLength = 0;

  constructor(private translocoService: TranslocoService, private formBuilder: FormBuilder) {
    this.createNewForm = this.formBuilder.group({
      context: this.contexts[0] || null,
      text: ' \n',
    });
  }

  ngOnChanges() {
    this.createNewForm.patchValue({ context: this.contexts[0] });
  }

  ngOnInit() {}

  onSubmit(data) {
    this.linkCreated.emit(data);
    this.createNewForm.patchValue({ text: '' });
  }

  getCurrentLength(event) {
    this.currentLength = event?.text?.length || '?';
  }
}
