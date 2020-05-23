import { DocumentStore } from '../../../stores/document.store';
import { DocumentModeStore } from '../../../stores/documentMode.store';
import { DOC_MODES } from '../../../models/docModes.enum';
import { ParagraphService } from '../../../services/paragraph.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentService } from '../../../services/document.service';
import { DocumentDefinition } from '../../../models/documentDefinition.interface';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import QuillUtils from 'src/app/utils/quill.utils';

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

  private content: string;
  private clickSubject = new Subject();
  private subscription = new Subscription();
  private style;
  private paragraphId;

  constructor(
    private documentService: DocumentService,
    private paragraphService: ParagraphService,
    private documentModeStore: DocumentModeStore,
    private documentStore: DocumentStore
  ) {}

  ngOnInit(): void {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.style = style.sheet;

    this.subscription.add(
      this.clickSubject.pipe(distinctUntilChanged(), debounceTime(300)).subscribe((event: string) => {
        this.documentStore.setParagraphId(event);
      })
    );

    this.subscription.add(this.documentStore.document$.subscribe(newDoc => this.switchDocument(newDoc)));
    this.subscription.add(this.documentModeStore.mode$.subscribe(m => this.switchMode(m)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClick(event) {
    if (RegExp(this.paragraphService.UUID_V4_REGEX_STR).test(event) && this.docMode !== DOC_MODES.READ) {
      this.paragraphId = event;
      let rule = '';
      if (this.docMode === DOC_MODES.REVIEW) {
        // TODO is it possible to use the scss variable value here?
        rule = `p.${event} {
          background-color: aliceblue;
        }`;
      } else {
        // margin-left: -padding-left + -1px
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
    console.log('onChange in document editor');
    if (!this.document) return;
    if (this.isLoading) {
      console.warn('Document Editor is loading new data, canceling on change event');
      return;
    }
    this.content = event.content;
    this.subscription.add(
      this.documentService
        .saveDocument(this.document.path, this.document.name, this.content)
        .subscribe((res: DocumentDefinition) => {
          this.document = res;
          const count = QuillUtils.calculateWordCount(event.plainContent);
          this.documentStore.setWordCount(count);
        })
    );
  }

  private switchMode(m) {
    if (this.docMode === m) return;
    this.isLoading = true;
    this.docMode = m;
    this.deleteParagraphStyles();

    if (m === DOC_MODES.REVIEW) {
      this.documentService
        .enhanceAndSaveDocument(this.document.path, this.document.name, this.content)
        .subscribe(res => {
          console.log('enhanceAndSaveDocument', res);
          this.editorData = res.content;
          this.content = res.content;
          this.isLoading = false;
          this.onClick(this.paragraphId);
        });
    } else {
      if (this.paragraphId) this.onClick(this.paragraphId);
      this.isLoading = false;
    }
  }

  private switchDocument(newDoc: DocumentDefinition) {
    console.log('switchDocument', newDoc);
    if (!newDoc) return;
    if (newDoc.path === this.document?.path && newDoc.name === this.document?.name) {
      console.warn(
        'Tried to switch to the same document again. Prevent saving and reload, do nothing instead.',
        newDoc?.name
      );
      return;
    }
    let loadObs;
    this.isLoading = true;
    // empty content for editor to prevent app from crashing when switching between two heavy documents
    // save this.content before doing so - emptying editorData could lead to a racing condition with the change event
    const contentToSave = this.content;
    this.editorData = ' ';
    this.paragraphId = null;
    // save old doc before switching
    if (this.document) {
      loadObs = this.documentService
        .saveDocument(this.document.path, this.document.name, contentToSave)
        .pipe(() => this.documentService.getDocument(newDoc.path, newDoc.name));
    } else {
      loadObs = this.documentService.getDocument(newDoc.path, newDoc.name);
    }
    this.subscription.add(
      loadObs.subscribe(res => {
        this.content = res.content;
        this.editorData = res.content;
        this.document = newDoc;
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
