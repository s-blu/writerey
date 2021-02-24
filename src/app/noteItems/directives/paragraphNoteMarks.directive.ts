import { HttpClient } from '@angular/common/http';
import { Directive, Input, OnDestroy } from '@angular/core';
import { DOC_MODES } from '@writerey/shared/models/docModes.enum';
import { DocumentDefinition } from '@writerey/shared/models/documentDefinition.interface';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { DocumentModeStore } from 'src/app/stores/documentMode.store';

@Directive({
  selector: '[wyParagraphNoteMarks]',
})
export class ParagraphNoteMarksDirective implements OnDestroy {
  @Input('wyParagraphNoteMarks') set document(d: DocumentDefinition) {
    if (d?.path !== this.doc?.path || d?.name !== this.doc?.name) {
      this.doc = d;
      this.getParagrahIds();
    }
  }

  private style;
  private doc;
  private mode;
  private paragraphIds;

  private subscription = new Subscription();
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(private httpClient: HttpClient, private api: ApiService, private documentModeStore: DocumentModeStore) {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.style = style.sheet;

    this.subscription.add(
      this.documentModeStore.mode$.subscribe(mode => {
        if (this.mode === mode) return;

        if (mode === DOC_MODES.READ) {
          this.clearStyles();
        } else if (this.mode === DOC_MODES.READ) {
          this.addParagraphIdStyles();
        }
        this.mode = mode;
        if (mode === DOC_MODES.READ) this.clearStyles();
      })
    );
  }

  getParagrahIds() {
    if (!this.doc) return;
    this.subscription.add(
      this.httpClient
        .get(this.api.getParagraphCountRoute(this.doc.name), { params: { doc_path: this.doc.path } })
        .pipe(
          catchError(err => {
            if (err.status === 404) return of('');
            return this.api.handleHttpError(err);
          })
        )
        .subscribe((res: string) => {
          const paragraphIds = (res || '').split('\n').filter(str => str !== '');
          this.paragraphIds = paragraphIds;
          this.addParagraphIdStyles();
        })
    );
  }

  clearStyles() {
    if (this.style?.cssRules?.length > 0) {
      for (let i = 0; i < this.style.cssRules.length; i++) {
        this.style.deleteRule(i);
      }
    }
  }

  addParagraphIdStyles() {
    this.clearStyles();
    this.paragraphIds.forEach(pId => {
      let rule = `p.${pId}::after {
        height: 12px;
        width: 12px;
        background-color: #88b4db;
        border-radius: 5px;
        content: ' ';
        display: inline-block;
        position: absolute;
        top: -10px;
        right: -5px;
      }`;
      this.style.insertRule(rule);

      rule = `p.${pId} {
        position: relative;
      }`;
      this.style.insertRule(rule);

      rule = `p.${pId} ~ p.${pId}::after {
        position: inherit;
        display: none;
        content: '';
      }`;
      this.style.insertRule(rule);
    });
  }
}
