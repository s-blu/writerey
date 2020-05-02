import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Note, Link } from 'src/app/models/notesItems.interface';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { getReadableNameForMarkerContext } from 'src/app/utils/marker.utils';
import { FADE_ANIMATIONS } from 'src/app/utils/animation.utils';
import { rotateAnimation } from 'angular-animations';

@Component({
  selector: 'wy-document-link',
  templateUrl: './documentLink.component.html',
  styleUrls: ['./documentLink.component.scss'],
  animations: [...FADE_ANIMATIONS, rotateAnimation()],
})
export class DocumentLinkComponent implements OnInit {
  @Input() link: Link;
  @Input() markerDefs: Array<MarkerDefinition>;

  @Output() deleteLink = new EventEmitter<any>();
  @Output() editLink = new EventEmitter<any>();

  contextName;
  isExpanded = false;
  constructor() {}

  ngOnInit() {
    this.isExpanded = !!this.link.keepOpen;

    if (this.link.context.includes(':')) {
      this.contextName = getReadableNameForMarkerContext(this.link.context, this.markerDefs);
    } else {
      this.contextName = this.link.context;
    }
  }

  delete() {
    this.deleteLink.emit(this.link);
  }

  changeKeepOpen() {
    this.link.keepOpen = !this.link.keepOpen;
    this.editLink.emit(this.link);
  }

  changeExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
