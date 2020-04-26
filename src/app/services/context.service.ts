import { MarkerStore } from 'src/app/stores/marker.store';
import { ContextStore } from './../stores/context.store';
import { ParagraphService } from './paragraph.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Marker } from '../models/marker.interface';
import { map } from 'rxjs/operators';
import { MarkerDefinition } from '../models/markerDefinition.class';
import { Subscription, of } from 'rxjs';
import { sortMarkerArray } from '../utils/marker.utils';

export enum DEFAULT_CONTEXTS {
  PARAGRAPH = 'paragraph',
  DOCUMENT = 'document',
}

@Injectable({
  providedIn: 'root',
})
export class ContextService implements OnDestroy {
  private markerDefinitions: Array<MarkerDefinition>;
  private subscription = new Subscription();

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  constructor(
    private paragraphService: ParagraphService,
    private contextStore: ContextStore,
    private markerStore: MarkerStore
  ) {
    this.subscription.add(this.markerStore.markerDefinitions$.subscribe(res => (this.markerDefinitions = res)));
  }

  getContextsForDocument(docPath: string, docName: string, paragraphId?: string) {
    const contexts: Array<string> = [DEFAULT_CONTEXTS.DOCUMENT];
    if (paragraphId) contexts.unshift(DEFAULT_CONTEXTS.PARAGRAPH);
    return this.paragraphService.getParagraphMeta(docPath, docName, paragraphId, 'markers').pipe(
      map(markers => {
        if (markers) {
          sortMarkerArray(markers, this.markerDefinitions);
          for (const m of markers) {
            contexts.push(this.getContextStringForMarker(m));
          }
        }

        this.contextStore.setContexts(contexts);
        return contexts;
      })
    );
  }

  getContextsForMarkerDefinition(markerDef: MarkerDefinition) {
    const contexts: Array<string> = [];
    if (!markerDef?.values) return contexts;
    const markers = [];

    for (const val of markerDef.values) {
      markers.push({ id: markerDef.id, valueId: val.id, index: markerDef.index } as Marker);
    }

    sortMarkerArray(markers, this.markerDefinitions);
    for (const m of markers) {
      contexts.push(this.getContextStringForMarker(m));
    }
    this.contextStore.setContexts(contexts);
    return of(contexts);
  }

  public getContextStringForMarker(marker: Marker) {
    if (!marker) return '';
    return `${marker.id}:${marker.valueId}`;
  }

  public getMarkerFromContextString(context: string) {
    if (!context) return null;
    const [id, valueId] = context.split(':');
    const newMarker: Marker = {
      id,
      valueId,
    };
    return newMarker;
  }
}
