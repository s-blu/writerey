import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'wy-upsert-label-value',
  templateUrl: './upsertLabelValue.component.html',
  styleUrls: ['./upsertLabelValue.component.scss'],
})
export class UpsertLabelValueComponent implements OnInit {
  @Input() parentForm;
  @Input() parentFormGroupName;

  @Output() valueRemoved = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  removeValue() {
    this.valueRemoved.emit();
  }
}
