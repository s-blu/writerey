import { Component, OnInit, Input } from '@angular/core';
import { DocumentDefinition } from '../../interfaces/documentDefinition.interface';

@Component({
  selector: 'wy-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() set document(doc: DocumentDefinition) {
    this.lastSave = doc.last_edited;
    this.docDef = doc;
  }
  docDef: DocumentDefinition;
  lastSave: Date;
  dummyDate = new Date();

  constructor() { }

  ngOnInit() {
  }

}
