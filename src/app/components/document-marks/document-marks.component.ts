import { DOC_MODES } from '../../models/docModes.enum';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wy-document-marks',
  templateUrl: './document-marks.component.html',
  styleUrls: ['./document-marks.component.scss'],
})
export class DocumentMarksComponent implements OnInit {
  @Input() mode: DOC_MODES;
  constructor() {}

  MODES = DOC_MODES;
  ngOnInit() {}
}
