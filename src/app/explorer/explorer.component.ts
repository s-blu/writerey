// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateNewLabelComponent } from '@writerey/labels/components/createNewLabel/createNewLabel.component';
import { DISTRACTION_FREE_STATES } from '@writerey/shared/models/distractionFreeStates.enum';
import { FADE_ANIMATIONS } from '@writerey/shared/utils/animation.utils';
import { Subscription } from 'rxjs';
import { LabelService } from 'src/app/services/label.service';
import { DistractionFreeStore } from '../stores/distractionFree.store';
import { ProjectStore } from '../stores/project.store';

@Component({
  selector: 'wy-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
  animations: FADE_ANIMATIONS,
})
export class ExplorerComponent implements OnInit, OnDestroy {
  selectedProject = null;
  distractionFreeStatus: DISTRACTION_FREE_STATES;
  DISTRACTION_FREE_STATES = DISTRACTION_FREE_STATES;
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
    private labelService: LabelService,
    private router: Router
  ) {}

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
          this.labelService.createNewLabelCategory(data.name).subscribe((res: any) => {
            this.router.navigate(['/labelDefinition'], { queryParams: { id: res[0]?.id } });
            this.changeTabIndex(1);
          })
        );
      })
    );
  }
}
