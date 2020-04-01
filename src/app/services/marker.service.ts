import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, flatMap, map } from 'rxjs/operators';

import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(
    private api: ApiService,
    private httpClient: HttpClient
  ) { }

  createNewMarkerCategory(name: string, type: MarkerTypes) {
    const newMarker = new MarkerDefinition(name, type);

    return this.getMarkerDefinitions().pipe(
      flatMap(markerDefRes => {
        let newMarkerDef;
        if (!markerDefRes) {
          newMarkerDef = [newMarker];
        } else {
          newMarkerDef = [newMarker, ...markerDefRes];
        }
        return this.setMarkerDefinitions(newMarkerDef);
      })
    );
  }

  getMarkerDefinitions() {
    const params = {
      marker_id: 'definitions',
      value_id: '',
    };

    return this.httpClient.get(this.api.getMarkerRoute('definitions')).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: string) => {
        return this.parseMarkerValueResponse(res);
      })
    );
  }

  setMarkerDefinitions(content) {
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    const file = new File([blob], name, { type: 'application/json' });

    const formdata = new FormData();
    formdata.append('file', file);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient.put(this.api.getMarkerRoute('definitions'), formdata, { headers: httpHeaders }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: string) => {
        return this.parseMarkerValueResponse(res);
      })
    );
  }

  saveMarkerValueNotes(markerId: string, valueId: string, content) {
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    const file = new File([blob], name, { type: 'application/json' });

    const formdata = new FormData();
    formdata.append('file', file);

    const params = {
      marker_id: markerId,
      value_id: valueId
    };

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.httpClient
      .put(this.api.getMarkerRoute(markerId), formdata, { headers: httpHeaders, params })
      .pipe(
        catchError(err => this.api.handleHttpError(err)),
        map((res: any) => this.parseMarkerValueResponse(res))
      );
  }

  getMarkerValueNotes(contextId): Observable<any> {
    const { markerId, valueId } = contextId.split(':');
    const params = {
      marker_id: markerId,
      value_id: valueId,
    };

    return this.httpClient.get(this.api.getMarkerRoute(markerId), { params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: string) => {
        return this.parseMarkerValueResponse(res);
      })
    );
  }

  private parseMarkerValueResponse(res) {
    console.log('parseMarkerValueResponse', res);
    if (!res || res === '') return res;
    try {
      const data = JSON.parse(res);
      return data;
    } catch {
      console.warn('Was not able to parse marker value meta. Returning result as-is.');
      return res;
    }
  }

}

enum MarkerTypes {
  NUMERIC = 'numeric',
  TEXT = 'text'
}

interface MarkerValue {
  id: string;
  name: string;
}
class MarkerDefinition {
  id: string;
  name: string;
  type: MarkerTypes;
  values: Array<MarkerValue>;

  constructor(name: string, type: MarkerTypes) {
    this.id = uuid.v4();
    this.name = name;
    this.type = type;
    this.values = [];
  }
}
