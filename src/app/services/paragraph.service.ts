import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ParagraphService {
  private UUID_V4_REGEX_STR = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
  private P_ID_REGEX = RegExp(`<div class="${this.UUID_V4_REGEX_STR}`);

  constructor() { }

  addParagraphIdentifierIfMissing(p) {
    if (p && p !== '' && !this.P_ID_REGEX.test(p)) {
      const id = uuid.v4();

      console.log('=========================');
      console.log('paragraph has no identifier, adding', p);
      return `${this.getParagraphWrapStart(id)}${p}${this.getParagraphWrapEnd()}`;
    }

    return p;
  }

  private getParagraphWrapStart(uuid) {
    return `<div class="${uuid} paragraph-wrap">`;
  }

  private getParagraphWrapEnd() {
    return `</div>`;
  }

}
