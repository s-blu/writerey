import { DocumentDefinition } from './../../interfaces/DocumentDefinition';
import { ApiService } from './../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
/** Flat node with expandable and level information */
interface ExplorerNode {
  expandable: boolean;
  name: string;
  level: number;
  path?: string;
}

@Component({
  selector: 'wy-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {
  @Output() docChanged: EventEmitter<DocumentDefinition> = new EventEmitter<DocumentDefinition>();
  tree;

  treeControl = new FlatTreeControl<ExplorerNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => [...node.dirs, ...node.files]);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  ngOnInit() {
    return this.httpClient.get(this.api.getDirectoryRoute()).subscribe((res: string) => {
      try {
        this.tree = JSON.parse(res);
        this.dataSource.data = this.tree.dirs;
      } finally {
        console.log(this.tree);
      }
    });
  }

  constructor(
    private httpClient: HttpClient,
    private api: ApiService
  ) {

  }

  openDocument(node) {
    console.log('openDocument', node)
    this.docChanged.emit({ name: node.name, path: node.path });
  }

  hasChild = (_: number, node: ExplorerNode) => node.expandable;
  isFile = (_: number, node: ExplorerNode) => node.path && node.path !== '';

  private _transformer(node, level: number) {
    return {
      expandable: node.dirs || node.files ? node.dirs.length > 0 || node.files.length > 0 : false,
      path: node.path,
      name: node.name,
      level
    };
  }
}
