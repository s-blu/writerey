import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CreateNewItemDialogComponent } from '../../createNewItemDialog/createNewItemDialog.component';
import { DocumentService } from 'src/app/services/document.service';
import { DirectoryService } from 'src/app/services/directory.service';
import { DocumentStore } from 'src/app/stores/document.store';

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
    private directoryService: DirectoryService,
    private documentStore: DocumentStore
  ) {}

  ngOnInit() {}

  createNewItem() {
    const dialogRef = this.dialog.open(CreateNewItemDialogComponent, {
      data: { dirPath: this.path, typeOfDialog: this.type },
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(name => {
        if (!name) return;
        let createObservable;
        if (this.type === 'file') createObservable = this.documentService.createDocument(this.path, name);
        if (this.type === 'dir') createObservable = this.directoryService.createDirectory(this.path, name);

        this.subscription.add(
          createObservable.subscribe((res: any) => {
            this.directoryService.getTree().subscribe(_ => {
              this.itemCreated.emit(res);
              if (this.type === 'file') this.documentStore.setFileInfo({ name: res.name, path: res.path });
            });
          })
        );
      })
    );
  }
}
