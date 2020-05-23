import { Component, OnInit, Input } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'wy-note-item-ckeditor-view',
  templateUrl: './noteItemCkeditorView.component.html',
  styleUrls: ['./noteItemCkeditorView.component.scss'],
})
export class NoteItemCkeditorViewComponent implements OnInit {
  @Input() data: string;

  Editor = DecoupledEditor;
  constructor() {}

  ngOnInit() {}
}
