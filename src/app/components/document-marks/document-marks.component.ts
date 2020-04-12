import { DocumentModeStore } from './../../stores/documentMode.store';
import { MarkerStore } from './../../stores/marker.store';
import { Subscription } from 'rxjs';
import { ParagraphService } from './../../services/paragraph.service';
import { DOC_MODES } from '../../models/docModes.enum';
import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FileInfo } from 'src/app/models/fileInfo.interface';
import { MarkerDefinition, MarkerTypes } from 'src/app/models/markerDefinition.class';
import { MarkerService } from 'src/app/services/marker.service';
import * as uuid from 'uuid';
import { Marker } from 'src/app/models/marker.interface';
import { DocumentStore } from 'src/app/stores/document.store';
@Component({
  selector: 'wy-document-marks',
  templateUrl: './document-marks.component.html',
  styleUrls: ['./document-marks.component.scss'],
})
export class DocumentMarksComponent implements OnInit, OnChanges, OnDestroy {
  paragraphId: string;
  fileInfo: FileInfo;
  markers: Array<Marker> = [];
  markersFromServer: Array<Marker> = [];
  values: any = {};
  markerDefinitions: Array<MarkerDefinition>;
  MODES = DOC_MODES;
  mode: DOC_MODES;
  TYPES = MarkerTypes;

  private subscription = new Subscription();

  constructor(
    private paragraphService: ParagraphService,
    private markerService: MarkerService,
    private markerStore: MarkerStore,
    private documentModeStore: DocumentModeStore,
    private documentStore: DocumentStore
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.markerStore.markerDefinitions$.subscribe(markerDefs => {
        this.markerDefinitions = markerDefs;
      })
    );
    this.subscription.add(this.documentModeStore.mode$.subscribe(mode => (this.mode = mode)));
    this.subscription.add(
      this.documentStore.paragraphId$.subscribe(id => {
        this.paragraphId = id;
        this.refresh();
      })
    );
    this.subscription.add(
      this.documentStore.fileInfo$.subscribe(fileInfo => {
        this.fileInfo = fileInfo;
        this.refresh();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refresh();
  }

  setValOfTextMarker(def, event) {
    const newValue = event.value;
    if (!newValue) {
      this.removeMarker(def.id);
      return;
    }

    this.upsertMarker(def.id, newValue);
  }

  setValOfNumMarker(def, event) {
    const newValue = event.value;

    if (newValue < def.start) {
      this.removeMarker(def.id);
      return;
    }
    let valueDef = def.values.find(v => v.name === newValue);
    if (!valueDef) {
      valueDef = {
        id: uuid.v4(),
        name: newValue,
      };
      def.values.push(valueDef);
      this.subscription.add(
        this.markerService.setMarkerDefinitions(this.markerDefinitions).subscribe(res => {
          this.markerDefinitions = res;
          this.upsertMarker(def.id, valueDef.id);
        })
      );
    } else {
      this.upsertMarker(def.id, valueDef.id);
    }
  }

  private refresh() {
    if (!this.fileInfo || !this.paragraphId) return;
    this.markers = [];
    this.values = {};
    this.subscription.add(
      this.paragraphService
        .getParagraphMeta(this.fileInfo.path, this.fileInfo.name, this.paragraphId, 'markers')
        .subscribe(res => {
          this.markersFromServer = res || [];
          this.updateDisplayInfo(res);
        })
    );
  }
  private removeMarker(markerId) {
    if (!markerId) return;
    const index = this.markers.findIndex(m => m.id === markerId);
    if (index === -1) return;

    this.subscription.add(
      this.markerService
        .removeMarkerFromParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.paragraphId,
          this.markersFromServer,
          markerId
        )
        .subscribe(res => {
          this.values[markerId] = undefined;
          this.markers.splice(index, 1);
          this.markersFromServer = res;
        })
    );
  }

  private upsertMarker(markerId, valueId) {
    this.subscription.add(
      this.markerService
        .upsertMarkerForParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.paragraphId,
          this.markersFromServer,
          markerId,
          valueId
        )
        .subscribe(res => {
          this.markersFromServer = res;
          this.updateDisplayInfo(res);
        })
    );
  }

  private updateDisplayInfo(responseFromServer) {
    this.markers = [];
    this.values = {};
    if (!responseFromServer) return;
    responseFromServer = JSON.parse(JSON.stringify(responseFromServer));
    for (const m of responseFromServer) {
      try {
        this.enhanceMarkerWithDisplayInfo(m);
        this.markers.push(m);
        if (m.type === MarkerTypes.TEXT) {
          this.values[m.id] = m.valueId;
        } else {
          this.values[m.id] = m.valueName;
        }
      } catch (err) {
        console.warn('Was not able to find a marker definition for a marker. Will remove it since it is invalid.', m);
      }
    }

    this.markers = this.markers.sort((markerA, markerB) => {
      if (markerA.index === undefined) return 1;
      if (markerA.index < markerB.index) return -1;
      if (markerA.index > markerB.index) return 1;
      return 0;
    });
  }

  private enhanceMarkerWithDisplayInfo(marker) {
    const markerDef = this.markerDefinitions.find(m => m.id === marker.id);
    if (markerDef) {
      marker.name = markerDef.name;
      marker.type = markerDef.type;
      marker.index = markerDef.index;
      const value = markerDef.values.find(val => val.id === marker.valueId);
      if (value) marker.valueName = value.name;
    } else {
      throw Error('Could not find Markerdefinition');
    }
  }
}
