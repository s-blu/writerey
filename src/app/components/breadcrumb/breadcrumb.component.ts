import { Component, OnInit, Input } from '@angular/core';
import { DocumentDefinition } from '../../interfaces/DocumentDefinition';

@Component({
  selector: 'wy-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() docDef: DocumentDefinition;


  constructor() { }

  ngOnInit() {
  }

}
