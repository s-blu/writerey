import { Subscription } from 'rxjs';
import { ParagraphService } from './../../services/paragraph.service';
import { DOC_MODES } from '../../models/docModes.enum';
import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FileInfo } from 'src/app/models/fileInfo.interface';
import { MarkerDefinition, MarkerTypes } from 'src/app/models/markerDefinition.class';
import { MarkerService } from 'src/app/services/marker.service';
import * as uuid from 'uuid';
import { Marker } from 'src/app/models/marker.interfacte';
import { ReturnStatement } from '@angular/compiler';
@Component({
  selector: 'wy-document-marks',
  templateUrl: './document-marks.component.html',
  styleUrls: ['./document-marks.component.scss'],
})
export class DocumentMarksComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: DOC_MODES;
  @Input() paragraphId: string;
  @Input() fileInfo: FileInfo;

  markers: Array<Marker> = [];
  markersFromServer: Array<Marker> = [];
  values: any = {};
  markerDefinitions: Array<MarkerDefinition>;
  MODES = DOC_MODES;
  TYPES = MarkerTypes;

  private subscription = new Subscription();

  constructor(private paragraphService: ParagraphService, private markerService: MarkerService) {}

  ngOnInit() {
    this.subscription.add(this.markerService.getMarkerDefinitions().subscribe(res => (this.markerDefinitions = res)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
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

  setValOfTextMarker(def, event) {
    const newValue = event.value;
    if (!newValue) {
      this.removeMarker(def.id);
      return;
    }
    const marker = this.markers.find(m => m.id === def.id);
    const markerFromServer = this.markersFromServer.find(m => m.id === def.id);
    const valueDef = def.values.find(v => v.id === newValue);

    if (marker) {
      markerFromServer.valueId = valueDef.id;
      marker.valueId = valueDef.id;
      marker.valueName = valueDef.name;
      this.saveMarkers();
    } else {
      this.addMarker(def.id, newValue);
    }
  }

  setValOfNumMarker(def, event) {
    const newValue = event.value;
    const marker = this.markers.find(m => m.id === def.id);
    const markerFromServer = this.markersFromServer.find(m => m.id === def.id);

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
        })
      );
    }

    if (marker) {
      markerFromServer.valueId = valueDef.id;
      marker.valueId = valueDef.id;
      marker.valueName = valueDef.name;
      this.saveMarkers();
    } else {
      this.addMarker(def.id, valueDef.id);
    }
  }

  private enhanceMarkerWithNames(marker) {
    const markerDef = this.markerDefinitions.find(m => m.id === marker.id);
    if (markerDef) {
      marker.name = markerDef.name;
      marker.type = markerDef.type;
      const value = markerDef.values.find(val => val.id === marker.valueId);
      if (value) marker.valueName = value.name;
    }
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
        })
    );
  }

  private saveMarkers() {
    this.subscription.add(
      this.markerService
        .saveMarkersForParagraph(this.fileInfo.path, this.fileInfo.name, this.paragraphId, this.markersFromServer)
        .subscribe(res => {
          this.markersFromServer = res;
          this.updateDisplayInfo(res);
        })
    );
  }

  private addMarker(markerId, valueId) {
    this.subscription.add(
      this.markerService
        .addMarkerToParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.paragraphId,
          this.markersFromServer,
          markerId,
          valueId
        )
        .subscribe(res => (this.markersFromServer = res))
    );
  }

  private updateDisplayInfo(responseFromServer) {
    this.markers = [];
    this.values = {};
    if (!responseFromServer) return;
    responseFromServer = JSON.parse(JSON.stringify(responseFromServer));

    for (const m of responseFromServer) {
      this.enhanceMarkerWithNames(m);
      if (m.type === MarkerTypes.TEXT) {
        this.values[m.id] = m.valueId;
      } else {
        this.values[m.id] = m.valueName;
      }
    }
    this.markers = responseFromServer;
  }
}
