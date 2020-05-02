import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DocumentStore } from 'src/app/stores/document.store';

@Component({
  selector: 'wy-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnChanges {
  @Input() document?;
  path: Array<string> = [];
  name = '';

  constructor(private documentStore: DocumentStore) {}

  ngOnInit() {
    if (!this.document) {
      this.documentStore.document$.subscribe(docDef => {
        this.setPathAndName(docDef);
      });
    } else {
      this.setPathAndName(this.document);
    }
  }

  ngOnChanges() {
    if (this.document) {
      this.setPathAndName(this.document);
    }
  }

  private setPathAndName(docDef) {
    if (!docDef) return;
    const pathParts = (docDef.path || '').split('/').filter(el => el && el !== '');
    this.path = pathParts;
    this.name = docDef?.name || '';
  }
}
