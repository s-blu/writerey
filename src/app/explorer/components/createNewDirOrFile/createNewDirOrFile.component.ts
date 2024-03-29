// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { translate } from '@ngneat/transloco';
import { StripFileEndingPipe } from '@writerey/shared/pipes/stripFileEnding.pipe';
import { of, Subscription, zip } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { CreateNewItemDialogComponent } from 'src/app/components/createNewItemDialog/createNewItemDialog.component';
import { DirectoryService } from 'src/app/services/directory.service';
import { DocumentService } from 'src/app/services/document.service';
import { DocumentStore } from 'src/app/stores/document.store';
import { DirectoryStore } from './../../../stores/directory.store';

@Component({
  selector: 'wy-create-new-dir-or-file',
  templateUrl: './createNewDirOrFile.component.html',
  styleUrls: ['./createNewDirOrFile.component.scss'],
})
export class CreateNewDirOrFileComponent implements OnInit, OnDestroy {
  @Input() type;
  @Input() path;

  @Output() itemCreated = new EventEmitter<any>();

  private subscription = new Subscription();
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  constructor(
    public dialog: MatDialog,
    private documentService: DocumentService,
    private documentStore: DocumentStore,
    private directoryService: DirectoryService,
    private directoryStore: DirectoryStore,
    private snackBar: MatSnackBar,
    private stripFileEndingPipe: StripFileEndingPipe
  ) {}

  ngOnInit() {}

  createNewItem() {
    const dialogRef = this.dialog.open(CreateNewItemDialogComponent, {
      data: { dirPath: this.path, typeOfDialog: this.type },
      minWidth: 500,
    });
    zip(dialogRef.afterClosed(), this.directoryStore.tree$)
      .pipe(
        take(1),
        mergeMap(([name, tree]) => {
          if (!name) return;
          const containingDir = this.getDirSubTree(tree);

          let createObservable;
          if (this.type === 'file') {
            const existing = containingDir.files.find(file => {
              return this.stripFileEndingPipe.transform(file.name).toLowerCase() === name.toLowerCase();
            });
            if (!existing) createObservable = this.documentService.createDocument(this.path, name);
          } else if (this.type === 'dir') {
            const existing = containingDir.dirs.find(dir => dir.name.toLowerCase() === name.toLowerCase());
            if (!existing) createObservable = this.directoryService.createDirectory(this.path, name);
          }

          if (!createObservable) {
            const snackBarMsg = translate('createDirOrFile.alreadyInUse');
            this.snackBar.open(snackBarMsg, null, {
              duration: 5000,
              horizontalPosition: 'right',
            });
            return of(null);
          }
          return createObservable;
        })
      )
      .subscribe((res: any) => {
        if (!res) return;
        this.itemCreated.emit(res);
        if (this.type === 'file') this.documentStore.setFileInfo({ name: res.name, path: res.path });
      });
  }

  private getDirSubTree(tree) {
    const pathParts = this.path.split('/');
    pathParts.shift();
    if (pathParts.length === 0) return tree;
    let subTree = tree;
    for (const pathPart of pathParts) {
      if (!subTree) {
        console.error('Could not find subtree to check for name existence', pathPart, tree);
        return tree;
      }
      subTree = subTree.dirs.find(dir => dir.name === pathPart);
    }
    return subTree;
  }
}
