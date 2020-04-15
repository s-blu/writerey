import { DocumentModeStore } from './../../stores/documentMode.store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DOC_MODES } from 'src/app/models/docModes.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-mode-switcher',
  templateUrl: './modeSwitcher.component.html',
  styleUrls: ['./modeSwitcher.component.scss'],
})
export class ModeSwitcherComponent implements OnInit, OnDestroy {
  private mode;

  private subscription = new Subscription();
  
  constructor(private documentModeStore: DocumentModeStore) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.subscription.add(this.documentModeStore.mode$.subscribe(mode => (this.mode = mode)));
  }

  review() {
    this.switchMode(DOC_MODES.REVIEW);
  }

  read() {
    this.switchMode(DOC_MODES.READ);
  }

  write() {
    this.switchMode(DOC_MODES.WRITE);
  }

  isActive(mode) {
    return { active: this.mode === mode };
  }

  private switchMode(newMode) {
    if (!newMode || this.mode === newMode) return;
    this.documentModeStore.setMode(newMode);
  }
}
