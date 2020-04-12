import { MarkerService } from './marker.service';
import { Injectable } from '@angular/core';

import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;

@Injectable({
  providedIn: 'root',
})
export class WyInitService {
  constructor(private markerService: MarkerService) {}

  init() {
    this.configureClassesForQuill();
    this.markerService.init();
  }

  private configureClassesForQuill() {
    const Parchment = Quill.import('parchment');
    const allowClasses = new Parchment.Attributor.Attribute('class', 'class');
    Parchment.register(allowClasses);
  }
}

export function initializeApp(appInitService: WyInitService) {
  return (): void => {
    return appInitService.init();
  };
}
