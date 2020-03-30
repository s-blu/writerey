import { ParagraphService } from '../../services/paragraph.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { DocumentDefinition } from '../../interfaces/documentDefinition.interface';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'wy-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
})
export class DocumentEditorComponent implements OnInit, OnDestroy {
  @Input() isLoading: boolean;
  @Input() document: DocumentDefinition;
  @Input() content: { content: string };

  @Output() hover: EventEmitter<any> = new EventEmitter();
  @Output() changeContent: EventEmitter<any> = new EventEmitter();

  private hoverSubject = new Subject();
  private subscription = new Subscription();
  private style;

  constructor(private documentService: DocumentService, private paragraphService: ParagraphService) { }

  ngOnInit(): void {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.style = style.sheet;

    this.subscription.add(
      this.hoverSubject
        .pipe(
          distinctUntilChanged(),
          debounceTime(300)
        )
        .subscribe(event => {
          this.hover.emit(event)
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClick(event) {
    if (RegExp(this.paragraphService.UUID_V4_REGEX_STR).test(event)) {
      const rule = `p.${event} {
        // margin-left: -4px;
        // border-left: 1px solid coral;
        // z-index: 5;
        // display: block;
        // position: relative;
        // padding-left: 2px;
        background-color: aliceblue;
      }`;
      if (this.style.cssRules.length > 0) this.style.deleteRule(0);
      this.style.insertRule(rule);

      this.hoverSubject.next(event);
    }
  }

  onBlur(event) {
    this.changeContent.emit(event.editor.getData());
  }

  onChange(event) {
    this.changeContent.emit(event.editor.getData());
  }
}
