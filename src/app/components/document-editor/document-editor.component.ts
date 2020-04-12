import { DocumentModeStore } from './../../stores/documentMode.store';
import { FileInfo } from '../../models/fileInfo.interface';
import { DOC_MODES } from '../../models/docModes.enum';
import { ParagraphService } from '../../services/paragraph.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { DocumentDefinition } from '../../models/documentDefinition.interface';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
})
export class DocumentEditorComponent implements OnInit, OnDestroy {
  @Input() set fileInfo(info: FileInfo) {
    if (!info) return;
    this.switchDocument(info);
  }

  @Output() clicked: EventEmitter<any> = new EventEmitter();
  @Output() changeContent: EventEmitter<any> = new EventEmitter();
  @Output() documentChanged: EventEmitter<any> = new EventEmitter();

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
    private documentModeStore: DocumentModeStore
  ) {}

  ngOnInit(): void {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.style = style.sheet;

    this.subscription.add(
      this.clickSubject.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(event => {
        this.clicked.emit(event);
      })
    );

    this.subscription.add(
      this.documentModeStore.mode$.subscribe(m => {
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
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClick(event) {
    if (RegExp(this.paragraphService.UUID_V4_REGEX_STR).test(event) && this.docMode !== DOC_MODES.READ) {
      let rule = '';
      if (this.docMode === DOC_MODES.REVIEW) {
        rule = `p.${event} {
          background-color: aliceblue;
        }`;
      } else {
        // margin-left: -padding-left + -1px
        rule = `p.${event} {
          margin-left: -9px;
          border-left: 1px solid rgb(193, 215, 234);
          z-index: 5;
          // display: block;
          // position: relative;
          padding-left: 8px;
        }`;
      }

      if (this.style.cssRules.length > 0) this.style.deleteRule(0);
      this.style.insertRule(rule);
      this.clickSubject.next(event);
    }
  }

  onBlur(event) {
    this.changeContent.emit(event);
  }

  onChange(event) {
    if (!this.document) return;
    this.content = event;
    this.subscription.add(
      this.documentService
        .saveDocument(this.document.path, this.document.name, event)
        .subscribe((res: DocumentDefinition) => {
          this.document = res;
          this.documentChanged.emit(res);
          console.log('saved', new Date().toLocaleString());
        })
    );
    this.changeContent.emit(event);
  }

  private switchDocument(info: FileInfo) {
    let loadObs;
    // save old doc before switching
    if (this.document) {
      loadObs = this.documentService
        .saveDocument(this.document.path, this.document.name, this.content)
        .pipe(() => this.documentService.getDocument(info.path, info.name));
    } else {
      loadObs = this.documentService.getDocument(info.path, info.name);
    }
    this.isLoading = true;
    this.subscription.add(
      loadObs.subscribe(res => {
        this.content = res.content;
        delete res.content;
        this.document = res;
        this.isLoading = false;
        this.documentChanged.emit(this.document);
      })
    );
  }
}
