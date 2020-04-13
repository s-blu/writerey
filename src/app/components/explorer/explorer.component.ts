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

@Component({
  selector: 'wy-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit, OnDestroy {
  @Output() markerChanged: EventEmitter<any> = new EventEmitter<any>();

  selectedProject = null;

  ngOnInit() {
    this.projectStore.project$.subscribe(project => {
      this.selectedProject = project;
    });
  }

  ngOnDestroy() {}

  constructor(public dialog: MatDialog, private projectStore: ProjectStore) {}

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
