import { ProjectStore } from './../../../stores/project.store';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateNewItemDialogComponent } from '../../createNewItemDialog/createNewItemDialog.component';

@Component({
  selector: 'wy-chooseFileForLinkDialog',
  templateUrl: './chooseFileForLinkDialog.component.html',
  styleUrls: ['./chooseFileForLinkDialog.component.scss'],
})
export class ChooseFileForLinkDialogComponent implements OnInit, OnDestroy {
  project;
  node;

  private subscription = new Subscription();
  constructor(
    private projectStore: ProjectStore,
    public dialogRef: MatDialogRef<ChooseFileForLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.subscription.add(this.projectStore.project$.subscribe(res => (this.project = res)));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setLink(node) {
    this.node = node;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.node);
  }
}
