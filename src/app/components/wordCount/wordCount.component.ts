import { DocumentStore } from 'src/app/stores/document.store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-word-count',
  templateUrl: './wordCount.component.html',
  styleUrls: ['./wordCount.component.scss'],
})
export class WordCountComponent implements OnInit, OnDestroy {
  wordCount: number;

  private subscription = new Subscription();
  constructor(private documentStore: DocumentStore) {}

  ngOnInit() {
    this.subscription.add(
      this.documentStore.wordCount$.subscribe(res => {
        this.wordCount = res;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
