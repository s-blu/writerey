import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SnapshotStore } from 'src/app/stores/snapshot.store';

@Component({
  selector: 'wy-last-modified',
  templateUrl: './lastModified.component.html',
  styleUrls: ['./lastModified.component.scss'],
})
export class LastModifiedComponent implements OnInit, OnDestroy {
  @Input() lastSave: Date;

  lastSnapshot: Date;

  private subscription = new Subscription();
  constructor(private snapshotStore: SnapshotStore) {}

  ngOnInit() {
    this.subscription.add(this.snapshotStore.snapshotDate$.subscribe(res => (this.lastSnapshot = res)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
