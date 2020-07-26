// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { FADE_ANIMATIONS } from '../../shared/utils/animation.utils';
import { DISTRACTION_FREE_STATES } from 'src/app/shared/models/distractionFreeStates.enum';
import { DistractionFreeStore } from '../../stores/distractionFree.store';
import { ProjectStore } from '../../stores/project.store';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewLabelComponent } from '../_labels/createNewLabel/createNewLabel.component';
import { Subscription } from 'rxjs';
import { LabelService } from 'src/app/services/label.service';

@Component({
  selector: 'wy-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class ExplorerComponent implements OnInit, OnDestroy {
  @Output() labelChanged: EventEmitter<any> = new EventEmitter<any>();

  selectedProject = null;
  distractionFreeStatus: DISTRACTION_FREE_STATES;
  DISTRACTION_FREE_STATES = DISTRACTION_FREE_STATES;
  // FIXME loosen this dependency again with proper routing
  activeLabelId: string;
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
    private labelService: LabelService
  ) {}

  openLabel(event) {
    this.labelChanged.emit(event);
    this.activeLabelId = event?.id;
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

  addNewLabelCategory() {
    const dialogRef = this.dialog.open(CreateNewLabelComponent);

    this.subscription.add(
      dialogRef.afterClosed().subscribe(data => {
        if (!data) return;
        this.subscription.add(
          this.labelService.createNewLabelCategory(data.name, data.type).subscribe((res: any) => {
            this.activeLabelId = res[0]?.id;
            this.labelChanged.emit(res[0]);
            this.changeTabIndex(1);
          })
        );
      })
    );
  }
}
