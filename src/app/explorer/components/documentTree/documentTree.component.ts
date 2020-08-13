// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { MatSnackBar } from '@angular/material/snack-bar';
import { DirectoryService } from 'src/app/services/directory.service';
import { DeletionService } from './../../../services/deletion.service';
import { RenameItemDialogComponent } from '../renameItemDialog/renameItemDialog.component';
import { DocumentService } from 'src/app/services/document.service';
import { DirectoryStore } from './../../../stores/directory.store';
import { DocumentStore } from '../../../stores/document.store';
import { Subscription, of } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { flatMap, filter } from 'rxjs/operators';
import { translate } from '@ngneat/transloco';
import { StripFileEndingPipe } from '@writerey/shared/pipes/stripFileEnding.pipe';

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
  currentStartPage;
  tree;
  openedDirs = {};
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
  moveNode;

  private subscription = new Subscription();

  ngOnInit() {
    this.currentStartPage = this.documentService.getStartPage();
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
    private deletionService: DeletionService,
    private snackBar: MatSnackBar
  ) {}

  setTree(tree) {
    if (!tree) return;
    this.tree = tree;
    this.dataSource.data = [...this.tree.dirs, ...this.tree.files];
    this.expandToActiveDocument();

    Object.keys(this.openedDirs).forEach(dir => {
      if (this.openedDirs[dir]) {
        this.expandDirectories(dir);
      }
    });
  }

  clickedDocument(node) {
    this.documentSelected.emit(node);
  }

  toggleStartPage(node) {
    if (this.isNodeCurrentStartPage(node)) {
      this.documentService.removeStartPage();
      this.currentStartPage = null;
      this.snackBar.open(translate('documentTree.snackBar.removeStartPage', { name: node.name }), '', {
        duration: 5000,
        horizontalPosition: 'right',
      });
    } else {
      const newStartPage = { path: node.path, name: node.name };
      this.documentService.setStartPage(newStartPage);
      this.currentStartPage = newStartPage;
      this.snackBar.open(translate('documentTree.snackBar.setStartPage', { name: node.name }), '', {
        duration: 5000,
        horizontalPosition: 'right',
      });
    }
  }

  isNodeCurrentStartPage(node) {
    return this.currentStartPage?.name === node.name && this.currentStartPage?.path === node.path;
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

  setMoveNode(node: ExplorerNode) {
    this.moveNode = node;
  }

  cancelMoving() {
    this.moveNode = null;
  }

  finishMoving(targetNode?) {
    let moveObs;
    const targetPath = targetNode ? `${targetNode.path}/${targetNode.name}` : this.project;

    if (this.moveNode.isFile) {
      moveObs = this.documentService.moveDocument(this.moveNode.path, this.moveNode.name, null, targetPath);
    } else {
      moveObs = this.directoryService.moveDirectory(this.moveNode.path, this.moveNode.name, null, targetPath);
    }

    moveObs.pipe(flatMap(_ => this.directoryService.getTree())).subscribe(_ => {
      this.moveNode = null;
    });
  }

  deleteItem(node, typeOfItem) {
    this.subscription.add(
      this.deletionService
        .handleDeleteUserInputAndSnapshot(node.name, typeOfItem)
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

  toggleExpand(node) {
    this.treeControl.toggle(node);
    this.openedDirs[`${node.path}/${node.name}`] = this.treeControl.isExpanded(node);
  }

  private expandToActiveDocument() {
    return this.expandDirectories(this.activeFileInfo?.path);
  }

  private expandDirectories(targetPath) {
    if (!this.highlightOpenDocument) return;
    if (!targetPath || !this.treeControl?.dataNodes) return;

    const flattenedTreeNodes = this.treeControl.dataNodes;
    const pathParts = targetPath.split('/');
    if (!pathParts || pathParts.length < 1) {
      console.warn(
        'expandDirectories was called with invalid argument. need a / separated path to expand to.',
        targetPath
      );
      return;
    }
    // first part is project itself and thus root of the tree
    let pathUpUntilNow = pathParts[0];
    pathParts.shift();

    for (const step of pathParts) {
      const nextDir = flattenedTreeNodes.find(dir => dir.name === step && dir.path === pathUpUntilNow);

      if (!nextDir) {
        console.warn('Could not find nextDir to expand tree for file', step, targetPath);
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
