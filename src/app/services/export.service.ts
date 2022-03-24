import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(private httpClient: HttpClient, private api: ApiService) {}

  export(filetype) {
    return this.httpClient
      .get(this.api.getExportRoute(filetype))
      .pipe(catchError(err => this.api.handleHttpError(err)));
  }
}
