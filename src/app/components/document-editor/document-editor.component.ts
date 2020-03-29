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

  constructor(private documentService: DocumentService, private paragraphService: ParagraphService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.hoverSubject
        .pipe(
          distinctUntilChanged(),
          debounceTime(300)
        )
        .subscribe(event => this.hover.emit(event))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onHover(event) {
    if (RegExp(this.paragraphService.UUID_V4_REGEX_STR).test(event)) {
      this.hoverSubject.next(event);
    }
  }

  onBlur(event) {
    console.log('blurred')
    this.changeContent.emit(event.editor.getData());
  }

  onChange(event) {
    this.changeContent.emit(event.editor.getData());
  }
}
