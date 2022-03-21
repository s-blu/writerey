import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(private httpClient: HttpClient, private api: ApiService) {}

  export(path = null) {
    return this.httpClient.get(this.api.getExportRoute(path)).pipe(catchError(err => this.api.handleHttpError(err)));
  }
}
