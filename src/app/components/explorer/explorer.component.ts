import { Subscription } from 'rxjs';
import { DirectoryService } from './../../services/directory.service';
import { CreateNewFileDialogComponent } from './../createNewFileDialog/createNewFileDialog.component';
import { DocumentService } from './../../services/document.service';
import { FileInfo } from '../../interfaces/fileInfo.interface';
import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
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
  selector: 'wy-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit, OnDestroy {
  @Output() docChanged: EventEmitter<FileInfo> = new EventEmitter<FileInfo>();
  // tree data
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
    private httpClient: HttpClient,
    private api: ApiService,
    private documentService: DocumentService,
    private directoryService: DirectoryService
  ) {}

  private fetchTree() {
    this.subscription.add(this.httpClient.get(this.api.getTreeRoute()).subscribe((res: string) => {
      try {
        this.tree = JSON.parse(res);
        this.dataSource.data = [...this.tree.dirs, ...this.tree.files];
      } finally {
        console.log('tree init', this.tree);
      }
    }));
  }

  openDocument(node) {
    console.log('openDocument', node);
    this.docChanged.emit({ name: node.name, path: node.path });
  }

  renameDir(node) {
    console.log('rename dir', node);
  }
  renameFile(node) {
    console.log('rename file', node);
  }
  addNewFile(node) {
    this.createNewChild('file', node);
  }

  addNewDir(node) {
    this.createNewChild('dir', node);
  }

  addNewDirOnRoot() {
    this.createNewChild('dir', { path: '/', name: '' });
  }

  private createNewChild(type, node) {
    const path = this.prettifyPath(node.path, node.name);
    const dialogRef = this.dialog.open(CreateNewFileDialogComponent, {
      data: { dirPath: path, typeOfDialog: type },
    });

    this.subscription.add(dialogRef.afterClosed().subscribe(name => {
      let createObservable;
      if (type === 'file') createObservable = this.documentService.createDocument(path, name);
      if (type === 'dir') createObservable = this.directoryService.createDirectory(path, name);

      this.subscription.add(createObservable.subscribe((res: any) => {
        this.fetchTree(); // FIXME implement way to only get the edited dir
        if (type === 'file') this.docChanged.emit({ name: res.name, path: res.path });
      }));
    }));
  }

  private prettifyPath(path, dirName) {
    if (!path || path === '') return dirName;
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
