import { DocumentStore } from './../../stores/document.store';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnapshotStore } from 'src/app/stores/snapshot.store';
import {
  wobbleAnimation,
} from 'angular-animations';

@Component({
  selector: 'wy-last-modified',
  templateUrl: './lastModified.component.html',
  styleUrls: ['./lastModified.component.scss'],
  animations: [wobbleAnimation()],
})
export class LastModifiedComponent implements OnInit, OnDestroy {
  lastSnapshot: Date;
  lastSave: Date;
  saved = false;

  private subscription = new Subscription();
  constructor(private snapshotStore: SnapshotStore, private documentStore: DocumentStore) {}

  ngOnInit() {
    this.subscription.add(this.snapshotStore.snapshotDate$.subscribe(res => (this.lastSnapshot = res)));
    this.subscription.add(
      this.documentStore.lastSaved$.subscribe(res => {
        this.lastSave = res;
        this.saved = !this.saved;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
