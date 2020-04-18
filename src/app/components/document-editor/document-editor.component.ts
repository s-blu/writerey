import { DocumentStore } from './../../stores/document.store';
import { DocumentModeStore } from './../../stores/documentMode.store';
import { DOC_MODES } from '../../models/docModes.enum';
import { ParagraphService } from '../../services/paragraph.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { DocumentDefinition } from '../../models/documentDefinition.interface';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import QuillUtils from 'src/app/utils/quill.utils';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
})
export class DocumentEditorComponent implements OnInit, OnDestroy {
  content: string;
  docMode: DOC_MODES;
  isLoading: boolean;
  document: DocumentDefinition;

  private clickSubject = new Subject();
  private subscription = new Subscription();
  private style;

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

      if (this.style.cssRules.length > 0) this.style.deleteRule(0);
      this.style.insertRule(rule);
      this.clickSubject.next(event);
    }
  }
  onChange(event) {
    if (!this.document) return;
    this.content = event.html;
    this.subscription.add(
      this.documentService
        .saveDocument(this.document.path, this.document.name, event.html)
        .subscribe((res: DocumentDefinition) => {
          this.document = res;
          console.log('saved', new Date().toLocaleString());
          const count = QuillUtils.calculateWordCount(event.text);
          this.documentStore.setWordCount(count);
        })
    );
  }

  private switchMode(m) {
    if (this.documentService === m) return;
    this.docMode = m;
    if (this.style?.cssRules?.length > 0) this.style.deleteRule(0);
    if (m === DOC_MODES.REVIEW) {
      this.isLoading = true;
      this.documentService
        .enhanceAndSaveDocument(this.document.path, this.document.name, this.content)
        .subscribe(res => {
          this.content = res.content;
          this.isLoading = false;
        });
    }
  }

  private switchDocument(newDoc: DocumentDefinition) {
    if (!newDoc) return;
    let loadObs;
    this.isLoading = true;
    // reset content first to prevent app from crashing when switching between two heavy documents
    this.content = '';
    // save old doc before switching
    if (this.document) {
      loadObs = this.documentService
        .saveDocument(this.document.path, this.document.name, this.content)
        .pipe(() => this.documentService.getDocument(newDoc.path, newDoc.name));
    } else {
      loadObs = this.documentService.getDocument(newDoc.path, newDoc.name);
    }
    this.subscription.add(
      loadObs.subscribe(res => {
        this.content = res.content;
        this.document = newDoc;
        this.isLoading = false;
      })
    );
  }
}
