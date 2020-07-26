// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { catchError } from 'rxjs/operators';
import { DocumentDefinition } from 'src/app/shared/models/documentDefinition.interface';
import { DocumentService } from 'src/app/services/document.service';
import { ProjectStore } from './../../../stores/project.store';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Link, DocumentLink } from 'src/app/shared/models/notesItems.interface';
import { LabelDefinition } from 'src/app/shared/models/labelDefinition.class';
import { getReadableNameForLabelContext } from 'src/app/shared/utils/label.utils';
import { FADE_ANIMATIONS } from 'src/app/shared/utils/animation.utils';
import { rotateAnimation } from 'angular-animations';
import { LinkService } from 'src/app/services/link.service';
import { take, flatMap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';

@Component({
  selector: 'wy-document-link',
  templateUrl: './documentLink.component.html',
  styleUrls: ['./documentLink.component.scss'],
  animations: [...FADE_ANIMATIONS, rotateAnimation()],
})
export class DocumentLinkComponent implements OnInit, OnDestroy {
  @Input() link: Link;
  @Input() labelDefs: Array<LabelDefinition>;

  @Output() deleteLink = new EventEmitter<any>();
  @Output() editLink = new EventEmitter<any>();

  contextName;
  fileInfo;
  content: string;
  isExpanded = false;
  unableToFetchDocument = false;
  private subscription = new Subscription();
  constructor(
    private linkService: LinkService,
    private documentService: DocumentService,
    private projectStore: ProjectStore
  ) {}

  ngOnInit() {
    this.isExpanded = !!this.link.keepOpen;

    if (this.link.context.includes(':')) {
      this.contextName = getReadableNameForLabelContext(this.link.context, this.labelDefs);
    } else {
      this.contextName = this.link.context;
    }
    this.subscription.add(
      this.projectStore.project$
        .pipe(
          take(1),
          flatMap((project: string) => {
            return this.linkService.getDocumentInfoForLink(project, this.link.linkId);
          })
        )
        .subscribe((documentLink: DocumentLink) => {
          if (!documentLink) return;
          this.fileInfo = { name: documentLink.name, path: documentLink.path };
          this.loadContentOnExpand();
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  delete() {
    this.deleteLink.emit(this.link);
  }

  changeKeepOpen() {
    this.link.keepOpen = !this.link.keepOpen;
    this.editLink.emit(this.link);
  }

  changeExpand() {
    this.isExpanded = !this.isExpanded;
    this.loadContentOnExpand();
  }

  private loadContentOnExpand() {
    if (this.isExpanded && this.fileInfo && this.content === undefined) {
      this.subscription.add(
        this.documentService
          .getDocument(this.fileInfo.path, this.fileInfo.name, true)
          .pipe(
            catchError(err => {
              this.unableToFetchDocument = true;
              return throwError(err);
            })
          )
          .subscribe((document: DocumentDefinition) => {
            if (!document) return;

            this.content = document.content || ' ';
          })
      );
    }
  }
}
