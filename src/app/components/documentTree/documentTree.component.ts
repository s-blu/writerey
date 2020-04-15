import { DocumentStore } from './../../stores/document.store';
import { Subscription } from 'rxjs';
import { DirectoryService } from './../../services/directory.service';
import { CreateNewFileDialogComponent } from './../createNewFileDialog/createNewFileDialog.component';
import { DocumentService } from './../../services/document.service';
import { FileInfo } from '../../models/fileInfo.interface';
import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';

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

  private fetchTree() {
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
    console.warn('rename dir not implemented yet', node);
  }
  renameFile(node) {
    console.warn('rename file not implemented yet', node);
  }
  addNewFile(node) {
    this.createNewChild('file', node);
  }

  addNewDir(node) {
    this.createNewChild('dir', node);
  }

  addNewItemOnRoot(type) {
    this.createNewChild(type, { path: '/', name: '' });
  }

  private createNewChild(type, node) {
    const path = this.prettifyPath(node.path, node.name);
    const dialogRef = this.dialog.open(CreateNewFileDialogComponent, {
      data: { dirPath: path, typeOfDialog: type },
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(name => {
        if (!name) return;
        let createObservable;
        if (type === 'file') createObservable = this.documentService.createDocument(path, name);
        if (type === 'dir') createObservable = this.directoryService.createDirectory(path, name);

        this.subscription.add(
          createObservable.subscribe((res: any) => {
            this.fetchTree(); // FIXME implement way to only get the edited dir
            if (type === 'file') this.documentStore.setFileInfo({ name: res.name, path: res.path });
          })
        );
      })
    );
  }

  private prettifyPath(path, dirName) {
    if (!path || path === '') return dirName;
    if (path === '/') path = this.project;
    return path + '/' + dirName;
  }

  /**
   * Tree functions
   */
  hasChild = (_: number, node: ExplorerNode) => node.expandable;
  isFile = (_: number, node: ExplorerNode) => node.isFile;

  private _transformer(node, level: number) {
    return {
      expandable: node.dirs || node.files ? node.dirs.length > 0 || node.files.length > 0 : false,
      path: node.path,
      name: node.name,
      isFile: node.isFile,
      level,
    };
  }
}
