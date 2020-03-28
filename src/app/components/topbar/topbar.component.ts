import { ApiService } from './../../services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CreateNewFileDialogComponent } from '../createNewFileDialog/createNewFileDialog.component';

@Component({
  selector: 'wy-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private api: ApiService
  ) { }

  ngOnInit() { }

  review() { }

  snapshot() {
    const formdata = new FormData();
    formdata.append('message', 'Automated Snapshot on ' + new Date().toLocaleString());
    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    this.httpClient
      .put(this.api.getGitRoute(), formdata, { headers: httpHeaders })
      .subscribe(res => {
        console.log('snapshotted', res)
      })
  }
}
