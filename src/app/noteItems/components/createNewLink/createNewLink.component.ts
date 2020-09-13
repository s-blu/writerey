// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ProjectStore } from '../../../stores/project.store';
import { LinkService } from '../../../services/link.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, take, flatMap } from 'rxjs/operators';
import { Link } from '@writerey/shared/models/notesItems.interface';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';
import { setDecoupledToolbar } from '@writerey/shared/utils/editor.utils';
import { ChooseFileForLinkDialogComponent } from '@writerey/noteItems/components/chooseFileForLinkDialog/chooseFileForLinkDialog.component';

@Component({
  selector: 'wy-create-new-link',
  templateUrl: './createNewLink.component.html',
  styleUrls: ['./createNewLink.component.scss'],
})
export class CreateNewLinkComponent implements OnInit, OnChanges, OnDestroy {
  @Input() contexts: Array<string> = [];
  @Input() contextNames: any = {};
  @Output() linkCreated = new EventEmitter<any>();

  createNewForm;
  selectedDocument;
  project;

  Editor = DecoupledEditor;
  editorConfig = {
    toolbar: ['bold', 'italic', 'underline', 'strike', '|', 'link'],
  };
  onReady = setDecoupledToolbar;

  private subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private linkService: LinkService,
    private projectStore: ProjectStore
  ) {
    this.createNewForm = this.formBuilder.group({
      context: this.contexts[0] || null,
      linkId: [null, [Validators.required]],
      text: ' \n',
    });
  }

  ngOnChanges() {
    this.createNewForm.patchValue({ context: this.contexts[0] });
  }

  ngOnInit() {
    this.subscription.add(this.projectStore.project$.pipe(take(1)).subscribe(res => (this.project = res)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(data) {
    this.linkCreated.emit(data);
    this.createNewForm.patchValue({ text: '', linkId: null });
    this.selectedDocument = null;
  }

  chooseDocument() {
    const dialogRef = this.dialog.open(ChooseFileForLinkDialogComponent);

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(
          flatMap(node => {
            return this.linkService.getLinkForDocument(node.name, node.path, this.project);
          })
        )
        .subscribe((link: Link) => {
          if (!link) return;
          this.selectedDocument = link;
          this.createNewForm.patchValue({ linkId: link.linkId });
        })
    );
  }
}
