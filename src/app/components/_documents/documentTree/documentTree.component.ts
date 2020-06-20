// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { StripFileEndingPipe } from './../../../pipes/stripFileEnding.pipe';
import { DirectoryService } from 'src/app/services/directory.service';
import { DeletionService } from './../../../services/deletion.service';
import { RenameItemDialogComponent } from './../../renameItemDialog/renameItemDialog.component';
import { DocumentService } from 'src/app/services/document.service';
import { DirectoryStore } from './../../../stores/directory.store';
import { DocumentStore } from '../../../stores/document.store';
import { Subscription, of } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { flatMap, filter } from 'rxjs/operators';

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
  @Input() showMenus: boolean;
  @Input() highlightOpenDocument: boolean;
  @Output() documentSelected = new EventEmitter<any>();

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
    this.subscription.add(this.directoryStore.tree$.subscribe(res => this.setTree(res)));

    this.subscription.add(
      this.documentStore.fileInfo$.subscribe(res => {
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
    private directoryStore: DirectoryStore,
    private documentStore: DocumentStore,
    private documentService: DocumentService,
    private directoryService: DirectoryService,
    private stripFileEndingPipe: StripFileEndingPipe,
    private deletionService: DeletionService
  ) {}

  setTree(tree) {
    if (!tree) return;
    this.tree = tree;
    this.dataSource.data = [...this.tree.dirs, ...this.tree.files];
  }

  clickedDocument(node) {
    this.documentSelected.emit(node);
  }

  renameDir(node) {
    this.renameItem(node, 'dir');
  }

  renameFile(node: ExplorerNode) {
    this.renameItem(node, 'file');
  }

  deleteDir(node: ExplorerNode) {
    this.deleteItem(node, 'dir');
  }

  deleteFile(node: ExplorerNode) {
    this.deleteItem(node, 'file');
  }

  deleteItem(node, typeOfItem) {
    this.subscription.add(
      this.deletionService
        .showDeleteConfirmDialog(node.name, typeOfItem)
        .pipe(
          filter(res => res),
          flatMap(_ => {
            let deleteObs = of({});
            if (typeOfItem === 'dir') deleteObs = this.directoryService.deleteDirectory(node.path, node.name);
            if (typeOfItem === 'file') deleteObs = this.documentService.deleteDocument(node.path, node.name);
            return deleteObs;
          }),
          flatMap(_ => this.directoryService.getTree())
        )
        .subscribe()
    );
  }

  renameItem(node, typeOfItem: 'dir' | 'file') {
    const dialogRef = this.dialog.open(RenameItemDialogComponent, {
      data: { oldName: this.stripFileEndingPipe.transform(node.name) },
    });

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(
          filter(res => res),
          flatMap(newName => {
            let moveObs = of({});
            if (typeOfItem === 'dir') moveObs = this.directoryService.moveDirectory(node.path, node.name, newName);
            if (typeOfItem === 'file') moveObs = this.documentService.moveDocument(node.path, node.name, newName);
            return moveObs;
          }),
          flatMap(_ => this.directoryService.getTree())
        )
        .subscribe()
    );
  }

  prettifyPath(node) {
    if (!node || node.path === '') return node.name;
    let path = node.path;
    if (node.path === '/') path = this.project;
    return path + '/' + node.name;
  }

  private expandToActiveDocument() {
    if (!this.highlightOpenDocument) return;
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
