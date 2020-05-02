import { DocumentDefinition } from 'src/app/models/documentDefinition.interface';
import { DocumentService } from 'src/app/services/document.service';
import { ProjectStore } from './../../../stores/project.store';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Link, DocumentLink } from 'src/app/models/notesItems.interface';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { getReadableNameForMarkerContext } from 'src/app/utils/marker.utils';
import { FADE_ANIMATIONS } from 'src/app/utils/animation.utils';
import { rotateAnimation } from 'angular-animations';
import { LinkService } from 'src/app/services/link.service';
import { take, flatMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wy-document-link',
  templateUrl: './documentLink.component.html',
  styleUrls: ['./documentLink.component.scss'],
  animations: [...FADE_ANIMATIONS, rotateAnimation()],
})
export class DocumentLinkComponent implements OnInit, OnDestroy {
  @Input() link: Link;
  @Input() markerDefs: Array<MarkerDefinition>;

  @Output() deleteLink = new EventEmitter<any>();
  @Output() editLink = new EventEmitter<any>();

  contextName;
  fileInfo;
  content: string;
  isExpanded = false;
  private subscription = new Subscription();
  constructor(
    private linkService: LinkService,
    private documentService: DocumentService,
    private projectStore: ProjectStore
  ) {}

  ngOnInit() {
    this.isExpanded = !!this.link.keepOpen;

    if (this.link.context.includes(':')) {
      this.contextName = getReadableNameForMarkerContext(this.link.context, this.markerDefs);
    } else {
      this.contextName = this.link.context;
    }
    this.projectStore.project$
      .pipe(
        take(1),
        flatMap((project: string) => {
          return this.linkService.getDocumentInfoForLink(project, this.link.linkId);
        }),
        flatMap((documentLink: DocumentLink) => {
          if (!documentLink) return;
          this.fileInfo = { name: documentLink.name, path: documentLink.path };
          return this.documentService.getDocument(documentLink.path, documentLink.name, true);
        })
      )
      .subscribe((document: DocumentDefinition) => {
        if (!document) return;

        this.content = document?.content || '';
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
