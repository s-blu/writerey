import { DISTRACTION_FREE_STATES } from './../../models/distractionFreeStates.enum';
import { DistractionFreeStore } from './../../stores/distractionFree.store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-distraction-free-mode',
  templateUrl: './distractionFreeMode.component.html',
  styleUrls: ['./distractionFreeMode.component.scss'],
})
export class DistractionFreeModeComponent implements OnInit, OnDestroy {
  distractionFreeState: DISTRACTION_FREE_STATES;

  states = DISTRACTION_FREE_STATES;

  private subscription = new Subscription();
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  constructor(private distractionFreeStore: DistractionFreeStore) {}

  ngOnInit() {
    this.subscription.add(
      this.distractionFreeStore.distractionFree$.subscribe(status => {
        this.distractionFreeState = status;
      })
    );
  }

  toggleDistractionFree() {
    let nextState = this.distractionFreeState + 1;
    if (nextState > DISTRACTION_FREE_STATES.FULL) {
      nextState = DISTRACTION_FREE_STATES.NONE;
    }
    this.distractionFreeStore.setDistractionFree(nextState);
  }
}
