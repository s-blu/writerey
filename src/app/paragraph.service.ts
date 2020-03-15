import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ParagraphService {
  private P_ID_KEYWORD = 'PARAGRAPH ID';
  private P_ID_REGEX = RegExp(`${this.P_ID_KEYWORD} [0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}`);

  constructor() { }

  addParagraphIdentifierIfMissing(p) {
    if (p && p !== '' && !this.P_ID_REGEX.test(p)) {
      console.log('paragraph has no identifier, adding', p);
      return this.getNewParagraphIdentifier() + p;
    }

    return p;
  }

  private getNewParagraphIdentifier() {
    return `<div style="display:none">${this.P_ID_KEYWORD} ${uuid.v4()}</div>`;
  }

}
