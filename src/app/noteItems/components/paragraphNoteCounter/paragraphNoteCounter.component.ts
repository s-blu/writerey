import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { DocumentDefinition } from './../../../shared/models/documentDefinition.interface';

@Component({
  selector: 'wy-paragraph-note-counter',
  templateUrl: './paragraphNoteCounter.component.html',
  styleUrls: ['./paragraphNoteCounter.component.scss'],
})
export class ParagraphNoteCounterComponent implements OnInit, OnChanges {
  @Input() set document(d: DocumentDefinition) {
    if (d?.path !== this.doc?.path && d?.name !== this.doc?.name) {
      this.doc = d;
      this.getParagrahIds();
    }
  }

  private style;
  private doc;

  constructor(private httpClient: HttpClient, private api: ApiService) {}

  ngOnInit() {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.style = style.sheet;
  }

  ngOnChanges(change) {
    console.log('chasd', change);
    if (
      change.document?.currentValue?.path !== this.doc?.path &&
      change.document?.currentValue?.name !== this.doc?.name
    ) {
      this.doc = change.document?.currentValue;
      this.getParagrahIds();
    }
  }

  getParagrahIds() {
    console.log('docu', this.doc);
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
        console.log('p count got res', paragraphIds);
        this.addParagraphIdStyles(paragraphIds);
      });
  }

  addParagraphIdStyles(pIds) {
    // todo reset
    pIds.forEach(pId => {
      // div :nth-child(1 of p.special) { color: green; }
      console.log('set style for pId', pId, `p.${pId}:first-of-type::after`);
      let rule = `p.${pId}::after {
        height: 12px;
        width: 12px;
        background-color: #3f51b5;
        border-radius: 50%;
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
