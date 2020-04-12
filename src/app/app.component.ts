import { DocumentModeStore } from './stores/documentMode.store';
import { DocumentService } from './services/document.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DOC_MODES } from './models/docModes.enum';
import { MarkerDefinition } from './models/markerDefinition.class';
import { DocumentStore } from './stores/document.store';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'writerey';

  markerDef: MarkerDefinition;
  paragraphId: string;

  isLoading = false;

  private subscription = new Subscription();

  constructor(private documentStore: DocumentStore, private documentModeStore: DocumentModeStore) {}

  ngOnInit() {
    this.subscription.add(this.documentStore.fileInfo$.subscribe(() => (this.markerDef = null)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // FIXME
  changeMarker(event: MarkerDefinition) {
    this.documentModeStore.setMode(DOC_MODES.WRITE);
    this.markerDef = event;
  }

  onEditorClick(event) {
    this.paragraphId = event;
  }
}
