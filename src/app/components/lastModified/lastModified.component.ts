import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wy-last-modified',
  templateUrl: './lastModified.component.html',
  styleUrls: ['./lastModified.component.scss'],
})
export class LastModifiedComponent implements OnInit {
  @Input() lastSave: Date;
  @Input() lastSnapshot: Date;

  constructor() {}

  ngOnInit() {
  }
}
