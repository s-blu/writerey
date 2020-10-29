// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Directive, Renderer2, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DistractionFreeStore } from '../../stores/distractionFree.store';

@Directive({
  selector: '[wyAddClassesForDistractionStates]',
})
export class AddClassesForDistractionStatesDirective implements OnDestroy {
  classesForStates = ['', 'distraction-free-half', 'distraction-free-full'];

  private subscription = new Subscription();

  constructor(renderer: Renderer2, hostElement: ElementRef, private distractionFreeStore: DistractionFreeStore) {
    this.subscription.add(
      this.distractionFreeStore.distractionFree$.subscribe(status => {
        const oldClassIndex = status === 0 ? this.classesForStates.length - 1 : status - 1;
        const oldClass = this.classesForStates[oldClassIndex];
        const newClass = this.classesForStates[status];

        if (oldClass !== '') {
          renderer.removeClass(hostElement.nativeElement, oldClass);
        }
        if (newClass !== '') {
          renderer.addClass(hostElement.nativeElement, newClass);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
