import { Component, OnInit, Input } from '@angular/core';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';

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
