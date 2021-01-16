// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOC_MODES } from '@writerey/shared/models/docModes.enum';
import { DocumentDefinition } from '@writerey/shared/models/documentDefinition.interface';
import EditorUtils from '@writerey/shared/utils/editor.utils';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DocumentService } from '../../../services/document.service';
import { ParagraphService } from '../../../services/paragraph.service';
import { DocumentStore } from '../../../stores/document.store';
import { DocumentModeStore } from '../../../stores/documentMode.store';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './documentEditor.component.html',
  styleUrls: ['./documentEditor.component.scss'],
})
export class DocumentEditorComponent implements OnInit, OnDestroy {
  editorData: string;
  docMode: DOC_MODES;
  DOC_MODES = DOC_MODES;
  isLoading: boolean;
  document: DocumentDefinition;

  private clickSubject = new Subject();
  private blurSubject = new Subject();
  private subscription = new Subscription();
  private style;
  private paragraphId;

  constructor(
    private documentService: DocumentService,
    private paragraphService: ParagraphService,
    private documentModeStore: DocumentModeStore,
    private documentStore: DocumentStore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.style = style.sheet;

    this.subscription.add(
      this.clickSubject.pipe(distinctUntilChanged(), debounceTime(300)).subscribe((event: string) => {
        this.documentStore.setParagraphId(event);

        // this.router.navigate([], {
        //   relativeTo: this.route,
        //   queryParams: {
        //     paragraphId: event,
        //   },
        //   queryParamsHandling: 'merge',
        //   skipLocationChange: true,
        // });
      })
    );

    this.subscription.add(
      this.route.queryParams
        .pipe(distinctUntilChanged((a, b) => a.name === b.name && a.path === b.path))
        .subscribe(params => {
          this.switchDocument(params.path, params.name);
        })
    );

    this.subscription.add(this.documentModeStore.mode$.subscribe(m => this.switchMode(m)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onParagraphIdUpdate(event) {
    if (RegExp(this.paragraphService.UUID_V4_REGEX_STR).test(event) && this.docMode !== DOC_MODES.READ) {
      this.paragraphId = event;
      let rule = '';
      if (this.docMode === DOC_MODES.REVIEW) {
        // TODO is it possible to use the scss variable value here?
        rule = `p.${event} {
          background-color: aliceblue;
        }`;
      } else {
        // margin-left is equals -(padding-left + 1px)
        rule = `p.${event} {
          margin-left: -9px;
          border-left: 1px solid rgb(193, 215, 234);
          z-index: 5;
          padding-left: 8px;
        }`;
      }

      this.deleteParagraphStyles();
      this.style.insertRule(rule);
      this.clickSubject.next(event);
    }
  }
  onChange(event) {
    if (!event?.document || !event?.content) return;
    if (this.isLoading) {
      console.warn('Document Editor is loading new data, canceling on change event');
      return;
    }
    this.subscription.add(
      this.documentService
        .saveDocument(event.document.path, event.document.name, event.content)
        .subscribe((res: DocumentDefinition) => {
          this.document = res;
          this.document.content = event.content;
          const count = EditorUtils.calculateWordCount(event.plainContent);
          this.documentStore.setWordCount(count);
        })
    );
  }

  onBlur(event) {
    if (!event?.document || !event?.content) return;
    this.blurSubject.next(event);
    this.subscription.add(
      this.documentService.saveDocument(event.document.path, event.document.name, event.content).subscribe()
    );
  }

  private switchMode(m) {
    if (this.docMode === m) return;
    this.isLoading = true;
    this.docMode = m;
    this.deleteParagraphStyles();

    if (m === DOC_MODES.REVIEW) {
      this.documentService
        .enhanceAndSaveDocument(this.document.path, this.document.name, this.document.content)
        .subscribe(res => {
          this.editorData = res.content;
          this.isLoading = false;
          this.onParagraphIdUpdate(this.paragraphId);
        });
    } else {
      if (this.paragraphId) this.onParagraphIdUpdate(this.paragraphId);
      this.isLoading = false;
    }
  }

  private switchDocument(path, name) {
    if (!path && !name) return;
    if (path === this.document?.path && name === this.document?.name) {
      console.warn('Tried to switch to the same document again. Prevent saving and reload, do nothing instead.', name);
      return;
    }
    // empty content for editor to prevent app from crashing when switching between two heavy documents
    this.editorData = ' ';
    this.isLoading = true;
    this.paragraphId = null;

    this.subscription.add(
      this.documentService.getDocument(path, name).subscribe(res => {
        this.documentModeStore.setMode(DOC_MODES.WRITE);
        this.editorData = res.content;
        this.document = res;
        this.isLoading = false;
      })
    );
  }

  private deleteParagraphStyles() {
    if (this.style?.cssRules?.length > 0) {
      for (let i = 0; i < this.style.cssRules.length; i++) {
        this.style.deleteRule(i);
      }
    }
  }
}
