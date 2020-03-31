import { Injectable } from '@angular/core';

import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;

@Injectable({
  providedIn: 'root'
})
export class WyInitService {

  constructor() { }

  init() {
    console.log('INIT')
    const Parchment = Quill.import('parchment');
    let Width = new Parchment.Attributor.Attribute('class', 'class');
    Parchment.register(Width);


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
