import { FADE_ANIMATIONS } from '../../utils/animation.utils';
import { DISTRACTION_FREE_STATES } from 'src/app/models/distractionFreeStates.enum';
import { DistractionFreeStore } from '../../stores/distractionFree.store';
import { ProjectStore } from '../../stores/project.store';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewMarkerComponent } from '../_markers/createNewMarker/createNewMarker.component';
import { Subscription } from 'rxjs';
import { MarkerService } from 'src/app/services/marker.service';

@Component({
  selector: 'wy-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class ExplorerComponent implements OnInit, OnDestroy {
  @Output() markerChanged: EventEmitter<any> = new EventEmitter<any>();

  selectedProject = null;
  distractionFreeStatus: DISTRACTION_FREE_STATES;
  DISTRACTION_FREE_STATES = DISTRACTION_FREE_STATES;
  // FIXME loosen this dependency again with proper routing
  activeMarkerId: string;
  tabIndex;

  private subscription = new Subscription();

  ngOnInit() {
    this.projectStore.project$.subscribe(project => {
      this.selectedProject = project;
    });
    this.distractionFreeStore.distractionFree$.subscribe(status => {
      this.distractionFreeStatus = status;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  constructor(
    public dialog: MatDialog,
    private projectStore: ProjectStore,
    private distractionFreeStore: DistractionFreeStore,
    private markerService: MarkerService
  ) {}

  openMarker(event) {
    this.markerChanged.emit(event);
    this.activeMarkerId = event?.id;
  }

  selectProject(event) {
    if (!event) return;
    this.projectStore.setProject(event);
  }

  resetProject() {
    this.projectStore.setProject(null);
  }

  changeTabIndex(index) {
    this.tabIndex = index;
  }

  addNewMarkerCategory() {
    const dialogRef = this.dialog.open(CreateNewMarkerComponent);

    this.subscription.add(
      dialogRef.afterClosed().subscribe(data => {
        if (!data) return;
        this.subscription.add(
          this.markerService.createNewMarkerCategory(data.name, data.type).subscribe((res: any) => {
            this.activeMarkerId = res[0]?.id;
            this.markerChanged.emit(res[0]);
            this.changeTabIndex(1);
          })
        );
      })
    );
  }
}
