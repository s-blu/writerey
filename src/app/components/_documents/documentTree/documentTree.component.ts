import { DocumentStore } from '../../../stores/document.store';
import { Subscription } from 'rxjs';
import { DirectoryService } from '../../../services/directory.service';
import { CreateNewItemDialogComponent } from '../../createNewItemDialog/createNewItemDialog.component';
import { DocumentService } from '../../../services/document.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
/** Flat node with expandable and level information */
interface ExplorerNode {
  expandable: boolean;
  name: string;
  level: number;
  path: string;
  isFile: boolean;
}

@Component({
  selector: 'wy-document-tree',
  templateUrl: './documentTree.component.html',
  styleUrls: ['./documentTree.component.scss'],
})
export class DocumentTreeComponent implements OnInit, OnDestroy {
  @Input() project: string;

  activeFileInfo;
  tree;
  treeControl = new FlatTreeControl<ExplorerNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => [...node.dirs, ...node.files]
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private subscription = new Subscription();

  ngOnInit() {
    this.fetchTree();
    this.subscription.add(
      this.documentStore.fileInfo$.pipe(delay(200)).subscribe(res => {
        this.activeFileInfo = res;
        this.expandToActiveDocument();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(
    public dialog: MatDialog,
    private documentService: DocumentService,
    private directoryService: DirectoryService,
    private documentStore: DocumentStore
  ) {}

  fetchTree() {
    console.log('fetching treee......');
    const params = {
      base: this.project || '',
    };
    this.subscription.add(
      this.directoryService.getTree(params).subscribe(res => {
        this.tree = res;
        this.dataSource.data = [...this.tree.dirs, ...this.tree.files];
      })
    );
  }

  openDocument(node) {
    this.documentStore.setFileInfo({ name: node.name, path: node.path });
  }

  renameDir(node) {
    // todo
    console.warn('rename dir not implemented yet', node);
  }
  renameFile(node) {
    // todo
    console.warn('rename file not implemented yet', node);
  }

  prettifyPath(node) {
    if (!node || node.path === '') return node.name;
    let path = node.path;
    if (node.path === '/') path = this.project;
    return path + '/' + node.name;
  }

  private expandToActiveDocument() {
    if (!this.activeFileInfo || !this.treeControl?.dataNodes) return;

    const flattenedTreeNodes = this.treeControl.dataNodes;
    const pathParts = this.activeFileInfo.path.split('/');
    // first part is project itself and thus root of the tree
    let pathUpUntilNow = pathParts[0];
    pathParts.shift();

    for (const step of pathParts) {
      const nextDir = flattenedTreeNodes.find(dir => dir.name === step && dir.path === pathUpUntilNow);

      if (!nextDir) {
        console.error('Could not find nextDir to expand tree for file', step, this.activeFileInfo);
        return;
      }

      this.treeControl.expand(nextDir);
      pathUpUntilNow = pathUpUntilNow === '' ? step : `${pathUpUntilNow}/${step}`;
    }
  }

  /**
   * Tree functions
   */
  hasChild = (_: number, node: ExplorerNode) => node.expandable;
  isFile = (_: number, node: ExplorerNode) => node.isFile;

  private _transformer(node, level: number): ExplorerNode {
    return {
      expandable: node.dirs || node.files ? node.dirs.length > 0 || node.files.length > 0 : false,
      path: node.path,
      name: node.name,
      isFile: node.isFile,
      level,
    };
  }
}
