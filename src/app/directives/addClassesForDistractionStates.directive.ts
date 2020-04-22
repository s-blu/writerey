import { DistractionFreeStore } from './../stores/distractionFree.store';
import { Directive, Renderer2, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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
