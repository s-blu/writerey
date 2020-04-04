import { MarkerTypes } from './../../models/markerDefinition.class';
import { Subscription } from 'rxjs';
import { ParagraphService } from './../../services/paragraph.service';
import { DOC_MODES } from '../../models/docModes.enum';
import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FileInfo } from 'src/app/models/fileInfo.interface';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { Marker } from 'src/app/models/marker.interfacte';
import { MarkerService } from 'src/app/services/marker.service';

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
    this.subscription.add(
      this.paragraphService
        .getParagraphMeta(this.fileInfo.path, this.fileInfo.name, this.paragraphId, 'markers')
        .subscribe(res => {
          if (!res) return;
          for (const m of res) {
            this.enhanceMarkerWithNames(m);
          }
          this.markers = res;
        })
    );
  }

  getValue(markerId) {
    console.log(
      'getvalue',
      markerId,
      this.markers.find(m => m.id === markerId),
      this.markers.find(m => m.id === markerId)?.valueId
    );
    return this.markers.find(m => m.id === markerId)?.valueId;
  }

  setValOfTextMarker(def, event) {
    console.log('setValOfTextMarker', def, event);
  }

  setValOfNumMarker(def, event) {
    console.log('setValOfNumMarker', def, event);
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
