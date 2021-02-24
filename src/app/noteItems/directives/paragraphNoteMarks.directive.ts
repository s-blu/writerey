import { HttpClient } from '@angular/common/http';
import { Directive, Input } from '@angular/core';
import { DocumentDefinition } from '@writerey/shared/models/documentDefinition.interface';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Directive({
  selector: '[wyParagraphNoteMarks]',
})
export class ParagraphNoteMarksDirective {
  @Input('wyParagraphNoteMarks') set document(d: DocumentDefinition) {
    console.log('change doc', d, this.doc);
    if (d?.path !== this.doc?.path || d?.name !== this.doc?.name) {
      this.doc = d;
      this.getParagrahIds();
    }
  }

  private style;
  private doc;

  constructor(private httpClient: HttpClient, private api: ApiService) {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.style = style.sheet;
    this.getParagrahIds();
  }

  getParagrahIds() {
    console.log('doausdo');
    if (!this.doc) return;
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
        console.log('gotres', paragraphIds);
        this.addParagraphIdStyles(paragraphIds);
      });
  }

  clearStyles() {
    if (this.style?.cssRules?.length > 0) {
      for (let i = 0; i < this.style.cssRules.length; i++) {
        this.style.deleteRule(i);
      }
    }
  }

  addParagraphIdStyles(pIds) {
    this.clearStyles();
    pIds.forEach(pId => {
      console.log('set style for pId', pId);
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
