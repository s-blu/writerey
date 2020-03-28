import { Component, OnInit, Input } from '@angular/core';
import { DocumentDefinition } from '../../interfaces/documentDefinition.interface';

@Component({
  selector: 'wy-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  path: Array<string> = [];
  name: string = '';

  @Input()
  set document(docDef: DocumentDefinition) {
    if (!docDef) return;
    const pathParts = (docDef.path || '').split('/').filter(el => el && el !== '');
    this.path = pathParts;
    this.name = docDef.name;
  }

  constructor() {}

  ngOnInit() {}
}
