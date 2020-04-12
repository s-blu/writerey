import { Component, OnInit, Input } from '@angular/core';
import { DocumentDefinition } from '../../models/documentDefinition.interface';
import { DocumentStore } from 'src/app/stores/document.store';

@Component({
  selector: 'wy-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  path: Array<string> = [];
  name = '';

  constructor(private documentStore: DocumentStore) {}

  ngOnInit() {
    this.documentStore.document$.subscribe(docDef => {
      if (!docDef) return;
      const pathParts = (docDef.path || '').split('/').filter(el => el && el !== '');
      this.path = pathParts;
      this.name = docDef.name;
    });
  }
}
