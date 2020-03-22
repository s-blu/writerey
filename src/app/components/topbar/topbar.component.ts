import { ApiService } from './../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wy-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  review() {

  }

  createNewFile() {
    return this.httpClient.get(this.api.getDirectoryRoute()).subscribe(res => console.log(res));
  }

}
