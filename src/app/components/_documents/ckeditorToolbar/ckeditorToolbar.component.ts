import { FADE_ANIMATIONS } from './../../../utils/animation.utils';
import { DocumentModeStore } from './../../../stores/documentMode.store';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DOC_MODES } from 'src/app/models/docModes.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-ckeditor-toolbar',
  templateUrl: './ckeditorToolbar.component.html',
  styleUrls: ['./ckeditorToolbar.component.scss'],
  animations: FADE_ANIMATIONS,
  encapsulation: ViewEncapsulation.None,
})
export class CkeditorToolbarComponent implements OnInit, OnDestroy {
  public readonly = false;

  private subscription = new Subscription();
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(private documentModeStore: DocumentModeStore) {}

  ngOnInit() {
    this.subscription.add(
      this.documentModeStore.mode$.subscribe(mode => {
        console.log('doc mode', mode,  mode === DOC_MODES.READ)
        this.readonly = mode === DOC_MODES.READ;
      })
    );
  }
}
