import { FileInfo } from './../../interfaces/fileInfo.interface';
import { ParagraphService } from './../../services/paragraph.service';
import { DOC_MODES } from '../../models/docModes.enum';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'wy-document-marks',
  templateUrl: './document-marks.component.html',
  styleUrls: ['./document-marks.component.scss'],
})
export class DocumentMarksComponent implements OnInit, OnChanges {
  @Input() mode: DOC_MODES;
  @Input() paragraphId: string;
  @Input() fileInfo: FileInfo;

  markers;

  constructor(private paragraphService: ParagraphService) {}

  MODES = DOC_MODES;
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('oninit markers', this.paragraphId, this.fileInfo);
    this.paragraphService
      .getParagraphMeta(this.fileInfo.path, this.fileInfo.name, this.paragraphId, 'markers')
      .subscribe(res => {
        console.log('got res in cpomponent', res);
        this.markers = res;
      });
  }
}
