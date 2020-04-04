import { MarkerTypes } from './../../models/markerDefinition.class';
import { Subscription } from 'rxjs';
import { ParagraphService } from './../../services/paragraph.service';
import { DOC_MODES } from '../../models/docModes.enum';
import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FileInfo } from 'src/app/models/fileInfo.interface';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { Marker } from 'src/app/models/marker.interfacte';
import { MarkerService } from 'src/app/services/marker.service';
import * as uuid from 'uuid';
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
          this.markersFromServer = JSON.parse(JSON.stringify(res));
          if (!res) return;
          for (const m of res) {
            this.enhanceMarkerWithNames(m);
            this.values[m.id] = m.valueId;
          }
          this.markers = res;
        })
    );
  }

  setValOfTextMarker(def, event) {
    let newValue = event.value;
    let marker = this.markers.find(m => m.id === def.id);
    if (!newValue) {
      this.subscription.add(
        this.markerService
          .removeMarkerFromParagraph(
            this.fileInfo.path,
            this.fileInfo.name,
            this.paragraphId,
            this.markersFromServer,
            def.id
          )
          .subscribe()
      );
    }

    const valueDef = def.values.find(v => v.value === newValue);
    if (marker) {
      marker.valueId = valueDef.id;
      marker.valueName = valueDef.name;
      this.subscription.add(
        (this.markersFromServer = this.markerService.saveMarkersForParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.paragraphId,
          this.markersFromServer
        ))
      );
    } else {
      this.subscription.add(
        (this.markersFromServer = this.markerService.addMarkerToParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.markersFromServer,
          this.paragraphId,
          def.id,
          newValue
        ))
      );
    }

    console.log('setValOfTextMarker', def, event);
  }

  setValOfNumMarker(def, event) {
    let newValue = event.value;
    let marker = this.markers.find(m => m.id === def.id);

    if (newValue < def.start) {
      console.log('new value is smaller remove marker');
      if (marker) {
        this.subscription.add(
          this.markerService.removeMarkerFromParagraph(
            this.fileInfo.path,
            this.fileInfo.name,
            this.paragraphId,
            this.markersFromServer,
            def.id
          )
        );
      }
    }
    let valueDef = def.values.find(v => v.value === newValue);
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
      marker.valueId = valueDef.id;
      marker.valueName = valueDef.name;
      this.subscription.add(
        (this.markersFromServer = this.markerService.saveMarkersForParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.paragraphId,
          this.markersFromServer
        ))
      );
    } else {
      this.subscription.add(
        (this.markersFromServer = this.markerService.addMarkerToParagraph(
          this.fileInfo.path,
          this.fileInfo.name,
          this.paragraphId,
          this.markersFromServer,
          def.id,
          newValue
        ))
      );
    }
  }

  private enhanceMarkerWithNames(marker) {
    const markerDef = this.markerDefinitions.find(m => m.id === marker.id);
    if (markerDef) {
      marker.name = markerDef.name;
      const value = markerDef.values.find(val => val.id === marker.valueId);
      if (value) marker.valueName = value.name;
    }
  }
}
