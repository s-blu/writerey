import { DirectoryService } from './../../services/directory.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CreateNewItemDialogComponent } from '../createNewItemDialog/createNewItemDialog.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'wy-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  @Output() projectSelected = new EventEmitter<string>();

  projects;

  private subscription = new Subscription();

  constructor(private dialog: MatDialog, private directoryService: DirectoryService) {}

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

        this.subscription.add(
          this.directoryService.createDirectory('/', name).subscribe((res: any) => {
            this.fetchProjects();
            this.selectProject(name);
          })
        );
      })
    );
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
