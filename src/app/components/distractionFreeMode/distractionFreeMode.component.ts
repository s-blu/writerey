import { DistractionFreeStore } from './../../stores/distractionFree.store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-distraction-free-mode',
  templateUrl: './distractionFreeMode.component.html',
  styleUrls: ['./distractionFreeMode.component.scss'],
})
export class DistractionFreeModeComponent implements OnInit, OnDestroy {
  isDistractionFree: boolean;

  private subscription = new Subscription();
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  constructor(private distractionFreeStore: DistractionFreeStore) {}

  ngOnInit() {
    this.subscription.add(
      this.distractionFreeStore.distractionFree$.subscribe(status => {
        console.log('this.distractionFreeStore.distractionFree$', !!status);
        this.isDistractionFree = !!status;
      })
    );
  }

  toggleDistractionFree() {
    this.distractionFreeStore.setDistractionFree(!this.isDistractionFree);
  }
}
