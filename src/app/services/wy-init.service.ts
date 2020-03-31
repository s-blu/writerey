import { Injectable } from '@angular/core';

import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;

@Injectable({
  providedIn: 'root'
})
export class WyInitService {

  constructor() { }

  init() {
    const Parchment = Quill.import('parchment');
    const allowClasses = new Parchment.Attributor.Attribute('class', 'class');
    Parchment.register(allowClasses);


    // let config = { scope: Parchment.Scope.BLOCK };
    // let SpanBlockClass = new Parchment.Attributor.Class('span-block', 'span', config);
    // Quill.register(SpanBlockClass, true);
  }

}

export function initializeApp(appInitService: WyInitService) {
  return (): void => {
    return appInitService.init();
  }
}
