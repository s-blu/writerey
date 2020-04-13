import { DirectoryService } from './../../services/directory.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { CreateNewFileDialogComponent } from '../createNewFileDialog/createNewFileDialog.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'wy-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects;

  private subscription = new Subscription();
  constructor(
    private dialog: MatDialog,
    private directoryService: DirectoryService,
    private httpClient: HttpClient,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.fetchProjects();
  }

  addNewProject() {
    const dialogRef = this.dialog.open(CreateNewFileDialogComponent, {
      data: { typeOfDialog: 'project' },
      width: '400px',
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(name => {
        if (!name) return;

        this.subscription.add(
          this.directoryService.createDirectory('/', name).subscribe((res: any) => {
            this.fetchProjects();
            // TODO SELECT PROJECT
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
      this.httpClient.get(this.api.getTreeRoute(), { params }).subscribe((res: string) => {
        try {
          const parsedRes = JSON.parse(res);
          this.projects = parsedRes.dirs;
        } finally {
          console.log('PROJECTS', this.projects);
        }
      })
    );
  }
}
