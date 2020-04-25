import { FADE_ANIMATIONS } from '../../utils/animation.utils';
import { DISTRACTION_FREE_STATES } from 'src/app/models/distractionFreeStates.enum';
import { DistractionFreeStore } from '../../stores/distractionFree.store';
import { ProjectStore } from '../../stores/project.store';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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

  ngOnInit() {
    this.projectStore.project$.subscribe(project => {
      this.selectedProject = project;
    });
    this.distractionFreeStore.distractionFree$.subscribe(status => {
      this.distractionFreeStatus = status;
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
