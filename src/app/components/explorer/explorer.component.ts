import { DistractionFreeStore } from './../../stores/distractionFree.store';
import { ProjectStore } from './../../stores/project.store';
import { Subscription } from 'rxjs';
import { DirectoryService } from './../../services/directory.service';
import { CreateNewFileDialogComponent } from './../createNewFileDialog/createNewFileDialog.component';
import { DocumentService } from './../../services/document.service';
import { FileInfo } from '../../models/fileInfo.interface';
import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'wy-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [style({ opacity: 0 }), animate(300)]),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ExplorerComponent implements OnInit, OnDestroy {
  @Output() markerChanged: EventEmitter<any> = new EventEmitter<any>();

  selectedProject = null;
  isDistractionFree: boolean;

  ngOnInit() {
    this.projectStore.project$.subscribe(project => {
      this.selectedProject = project;
    });
    this.distractionFreeStore.distractionFree$.subscribe(status => {
      this.isDistractionFree = status;
    });
  }

  ngOnDestroy() {}

  constructor(
    public dialog: MatDialog,
    private projectStore: ProjectStore,
    private distractionFreeStore: DistractionFreeStore
  ) {}

  openMarker(event) {
    this.markerChanged.emit(event);
  }

  selectProject(event) {
    if (!event) return;
    this.projectStore.setProject(event);
  }

  resetProject() {
    this.projectStore.setProject(null);
  }
}
