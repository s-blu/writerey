import { Component, OnInit, Input } from '@angular/core';
import { DocumentDefinition } from '../../interfaces/DocumentDefinition';

@Component({
  selector: 'wy-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() docDef: DocumentDefinition;

  dummyDate = new Date();

  constructor() { }

  ngOnInit() {
  }

}
