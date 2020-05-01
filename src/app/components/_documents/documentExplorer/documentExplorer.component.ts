import { DocumentStore } from './../../../stores/document.store';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wy-document-explorer',
  templateUrl: './documentExplorer.component.html',
  styleUrls: ['./documentExplorer.component.scss'],
})
export class DocumentExplorerComponent implements OnInit {
  @Input() project;

  constructor(private documentStore: DocumentStore) {}

  ngOnInit() {}

  openDocument(node) {
    this.documentStore.setFileInfo({ name: node.name, path: node.path });
  }
}
