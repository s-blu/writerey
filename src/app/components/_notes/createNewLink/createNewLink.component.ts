import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'wy-create-new-link',
  templateUrl: './createNewLink.component.html',
  styleUrls: ['./createNewLink.component.scss'],
})
export class CreateNewLinkComponent implements OnInit, OnChanges {
  @Input() contexts: Array<string> = [];
  @Input() contextNames: any = {};
  @Output() linkCreated = new EventEmitter<any>();

  createNewForm;
  maxLength = 100;
  currentLength = 0;
  quillConfig = {
    modules: {
      toolbar: [['bold', 'italic', 'underline', 'strike'], ['link']],
    },
    styles: {
      'font-family': 'Roboto, "Helvetica Neue", sans-serif',
      'font-size': '14px',
    },
  };

  constructor(private formBuilder: FormBuilder) {
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
