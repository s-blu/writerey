// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DirectoryService } from './../../services/directory.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CreateNewItemDialogComponent } from '../createNewItemDialog/createNewItemDialog.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { translate } from '@ngneat/transloco';

@Component({
  selector: 'wy-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  @Output() projectSelected = new EventEmitter<string>();

  projects;

  private subscription = new Subscription();

  constructor(private dialog: MatDialog, private directoryService: DirectoryService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.fetchProjects();
  }

  selectProject(projectname) {
    this.projectSelected.emit(projectname);
  }

  addNewProject() {
    const dialogRef = this.dialog.open(CreateNewItemDialogComponent, {
      data: { typeOfDialog: 'project' },
      width: '400px',
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(name => {
        if (!name) return;

        if (this.isNameAlreadyInUse(name)) {
          const snackBarMsg = translate('projects.nameAlreadyInUse');
          this.snackBar.open(snackBarMsg, null, {
            duration: 5000,
            horizontalPosition: 'right',
          });
          return;
        }

        this.subscription.add(
          this.directoryService.createDirectory('/', name).subscribe((res: any) => {
            this.fetchProjects();
            this.selectProject(name);
          })
        );
      })
    );
  }

  private isNameAlreadyInUse(name): boolean {
    if (!name || !this.projects) return false;
    return this.projects.some(p => p.name.toLowerCase() === name.toLowerCase());
  }

  private fetchProjects() {
    const params = {
      root_only: 'true',
    };

    this.subscription.add(
      this.directoryService.getTree(params).subscribe(res => {
        this.projects = res?.dirs;
      })
    );
  }
}
