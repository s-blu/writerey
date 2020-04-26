import { DeletionService } from '../../../services/deletion.service';
import { CreateNewMarkerComponent } from '../createNewMarker/createNewMarker.component';
import { Subscription } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { MarkerService } from 'src/app/services/marker.service';
import { MarkerDefinition } from 'src/app/models/markerDefinition.class';
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
  @Input() activeMarkerId;

  @Output() markerChanged: EventEmitter<any> = new EventEmitter<any>();

  markerDefinitions: Array<MarkerDefinition>;
  // Tree Controls
  treeControl = new FlatTreeControl<MarkerNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    () => []
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
        this.markerService.deleteMarkerCategory(node.id).subscribe(() => {
          // TODO show snackbar
        });
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
