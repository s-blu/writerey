import { DeletionService } from '../../services/deletion.service';
import { DeleteConfirmationDialogComponent } from './../deleteConfirmationDialog/deleteConfirmationDialog.component';
import { CreateNewMarkerComponent } from './../createNewMarker/createNewMarker.component';
import { Subscription } from 'rxjs';
import { DirectoryService } from './../../services/directory.service';
import { CreateNewFileDialogComponent } from './../createNewFileDialog/createNewFileDialog.component';
import { DocumentService } from './../../services/document.service';
import { FileInfo } from '../../models/fileInfo.interface';
import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { MarkerService } from 'src/app/services/marker.service';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
import { ReturnStatement } from '@angular/compiler';
import { MarkerStore } from 'src/app/stores/marker.store';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
/** Flat node with expandable and level information */
interface MarkerNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'wy-marker-tree',
  templateUrl: './markerTree.component.html',
  styleUrls: ['./markerTree.component.scss'],
})
export class MarkerTreeComponent implements OnInit, OnDestroy {
  @Input() project;

  @Output() markerChanged: EventEmitter<any> = new EventEmitter<any>();

  markerDefinitions: Array<MarkerDefinition>;
  treeControl = new FlatTreeControl<MarkerNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => []
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private deletionService: DeletionService,
    private markerService: MarkerService,
    private markerStore: MarkerStore
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.markerStore.markerDefinitions$.subscribe(markerDefs => {
        this.markerDefinitions = markerDefs;
        this.dataSource.data = this.markerDefinitions;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openMarkerCategory(node) {
    const markerDef = this.markerDefinitions.find(el => el.id === node.id);
    this.markerChanged.emit(markerDef);
  }

  removeMarker(node) {
    this.subscription.add(
      this.deletionService.showDeleteConfirmDialog(node.name, 'marker').subscribe(result => {
        if (!result) return;
        this.markerService.deleteMarkerCategory(node.id).subscribe(res => {
          // TODO show snackbar
        });
      })
    );
  }

  addNewMarkerCategory() {
    const dialogRef = this.dialog.open(CreateNewMarkerComponent);

    this.subscription.add(
      dialogRef.afterClosed().subscribe(data => {
        if (!data) return;
        this.subscription.add(
          this.markerService.createNewMarkerCategory(data.name, data.type).subscribe((res: any) => {
            this.markerChanged.emit(res[0]);
          })
        );
      })
    );
  }

  /**
   * Tree functions
   */
  hasChild = (_: number, node: MarkerNode) => node.expandable;

  private _transformer(node, level: number) {
    return {
      expandable: false,
      name: node.name,
      id: node.id,
      level,
    };
  }
}
