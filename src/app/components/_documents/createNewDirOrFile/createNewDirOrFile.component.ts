import { StripFileEndingPipe } from './../../../pipes/stripFileEnding.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DirectoryStore } from './../../../stores/directory.store';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription, merge, forkJoin, combineLatest, zip, of } from 'rxjs';
import { CreateNewItemDialogComponent } from '../../createNewItemDialog/createNewItemDialog.component';
import { DocumentService } from 'src/app/services/document.service';
import { DirectoryService } from 'src/app/services/directory.service';
import { DocumentStore } from 'src/app/stores/document.store';
import { mergeAll, mergeMap, take, flatMap } from 'rxjs/operators';
import { translate } from '@ngneat/transloco';

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
    });
    zip(dialogRef.afterClosed(), this.directoryStore.tree$)
      .pipe(
        take(1),
        flatMap(([name, tree]) => {
          if (!name) return;
          console.log('zipped', name, tree, this.path);
          const containingDir = this.getDirSubTree(tree);
          console.log('containingDir', containingDir);
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
        this.directoryService.getTree().subscribe(_ => {
          this.itemCreated.emit(res);
          if (this.type === 'file') this.documentStore.setFileInfo({ name: res.name, path: res.path });
        });
      });
  }

  private getDirSubTree(tree) {
    const pathParts = this.path.split('/');
    pathParts.shift();
    console.log(pathParts);
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
