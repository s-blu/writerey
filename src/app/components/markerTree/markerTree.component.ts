import { CreateNewMarkerComponent } from './../createNewMarker/createNewMarker.component';
import { Subscription } from 'rxjs';
import { DirectoryService } from './../../services/directory.service';
import { CreateNewFileDialogComponent } from './../createNewFileDialog/createNewFileDialog.component';
import { DocumentService } from './../../services/document.service';
import { FileInfo } from '../../interfaces/fileInfo.interface';
import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { MarkerService } from 'src/app/services/marker.service';

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
  styleUrls: ['./markerTree.component.scss']
})
export class MarkerTreeComponent implements OnInit, OnDestroy {

  @Output() markerChanged: EventEmitter<any> = new EventEmitter<any>();
  // tree data
  tree;
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

  ngOnInit() {

    this.fetchTree();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private api: ApiService,
    private markerService: MarkerService
  ) { }

  private fetchTree() {
    this.markerService.getMarkerDefinitions().subscribe((res) => {
      console.log('got definitions from marker service', res)
      this.dataSource.data = res;
    })
  }

  openMarkerCategory(node) {
    this.markerChanged.emit({ id: node.id });
  }

  removeMarker(node) {

  }

  addNewMarkerCategory() {
    this.createNewChild('dir', { path: '/', name: '' });
  }

  private createNewChild(type, node) {
    const dialogRef = this.dialog.open(CreateNewMarkerComponent);

    this.subscription.add(dialogRef.afterClosed().subscribe(data => {
      this.subscription.add(this.markerService.createNewMarkerCategory(data.name, data.type).subscribe((res: any) => {
        console.log('created marker got res', res)
        this.fetchTree(); // FIXME implement way to only get the edited dir
        this.markerChanged.emit({ id: res.id });
      }));
    }));
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
      level
    };
  }
}
