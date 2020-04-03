import { Component, OnInit, Input } from '@angular/core';
import { DocumentDefinition } from '../../models/documentDefinition.interface';

@Component({
  selector: 'wy-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() set document(doc: DocumentDefinition) {
    if (!doc) return;
    this.lastSave = doc.last_edited;
    this.docDef = doc;
  }
  @Input() lastSnapshotDate: Date;

  docDef: DocumentDefinition;
  lastSave: Date;

  constructor() { }

  ngOnInit() { }
}
