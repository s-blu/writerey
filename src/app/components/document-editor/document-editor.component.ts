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
    let loadObs;
    // save old doc before switching
    if (this.document) {
      loadObs = this.documentService.saveDocument(this.document.path, this.document.name, this.content)
        .pipe(() => this.documentService.getDocument(info.path, info.name));
    } else {
      loadObs = this.documentService.getDocument(info.path, info.name);
    }

    this.isLoading = true;
    this.subscription.add(loadObs.subscribe(res => {
      this.content = res.content;
      delete res.content;
      this.document = res;
      this.isLoading = false;
      this.documentChanged.emit(this.document)
    }));
  }
  @Input() set mode(m: DOC_MODES) {
    this.docMode = m;
    if (m === DOC_MODES.REVIEW) {
      this.isLoading = true;
      this.documentService.enhanceAndSaveDocument(this.document.path, this.document.name, this.content).subscribe(res => {
        this.content = res.content;
        this.isLoading = false;
      });
    }

  };

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

  constructor(private documentService: DocumentService, private paragraphService: ParagraphService) { }

  ngOnInit(): void {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.style = style.sheet;

    this.subscription.add(
      this.clickSubject
        .pipe(
          distinctUntilChanged(),
          debounceTime(300)
        )
        .subscribe(event => {
          this.clicked.emit(event);
        })
    );
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClick(event) {
    if (RegExp(this.paragraphService.UUID_V4_REGEX_STR).test(event)) {
      if (this.docMode === DOC_MODES.REVIEW) {
        const rule = `p.${event} {
          background-color: aliceblue;
        }`;
        if (this.style.cssRules.length > 0) this.style.deleteRule(0);
        this.style.insertRule(rule);
      }
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
          console.log('saved', new Date().toLocaleString())
        }));
    this.changeContent.emit(event);
  }
}
