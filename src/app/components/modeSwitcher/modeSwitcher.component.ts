import { DocumentModeStore } from './../../stores/documentMode.store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DOC_MODES } from 'src/app/models/docModes.enum';
import { Subscription } from 'rxjs';
import { DocumentStore } from 'src/app/stores/document.store';

@Component({
  selector: 'wy-mode-switcher',
  templateUrl: './modeSwitcher.component.html',
  styleUrls: ['./modeSwitcher.component.scss'],
})
export class ModeSwitcherComponent implements OnInit, OnDestroy {
  docLoaded: boolean;
  modes = Object.values(DOC_MODES);
  private mode;
  private subscription = new Subscription();

  constructor(private documentModeStore: DocumentModeStore, private documentStore: DocumentStore) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.subscription.add(this.documentModeStore.mode$.subscribe(mode => (this.mode = mode)));
    this.subscription.add(this.documentStore.document$.subscribe(doc => (this.docLoaded = !!doc)));
  }

  isActive(mode) {
    const isActive = this.mode === mode && this.docLoaded;
    return { active: isActive, 'mat-elevation-z2': isActive };
  }

  switchMode(newMode) {
    if (!newMode || this.mode === newMode) return;
    this.documentModeStore.setMode(newMode);
  }
}
