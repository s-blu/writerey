import { ParagraphService } from './paragraph.service';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { MarkerDefinition, MarkerTypes } from '../models/markerDefinition.class';
import { Marker } from '../models/marker.interfacte';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private api: ApiService, private httpClient: HttpClient, private paragraphService: ParagraphService) {}

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

  deleteMarkerCategory(markerId: string) {
    if (!markerId) return;
    // TODO REMOVE META FILES

    return this.getMarkerDefinitions().pipe(
      flatMap(markerDefRes => {
        if (!markerDefRes) return;
        const index = markerDefRes.findIndex(m => m.id === markerId);
        if (index > -1) {
          markerDefRes.splice(index, 1);
          return this.setMarkerDefinitions(markerDefRes);
        }
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

  updateMarkerDefinition(markerDef: MarkerDefinition) {
    return this.getMarkerDefinitions().pipe(
      flatMap(markerDefRes => {
        let updatedMarkerDefs;
        if (!markerDefRes) {
          console.error('Could not get any marker definitions, even though I try to update an existing one. Aborting.');
          return;
        } else {
          const oldIndex = markerDefRes.findIndex(el => el.id === markerDef.id);
          if (oldIndex === -1) {
            console.warn('could not find old item for markerDef. Inserting new.', markerDef);
            updatedMarkerDefs = [markerDef, ...markerDefRes];
          } else {
            updatedMarkerDefs = markerDefRes;
            updatedMarkerDefs.splice(oldIndex, 1, markerDef);
          }
        }
        return this.setMarkerDefinitions(updatedMarkerDefs);
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

  saveNotesForMarkerValue(markerId: string, valueId: string, content) {
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    const file = new File([blob], name, { type: 'application/json' });

    const formdata = new FormData();
    formdata.append('file', file);

    const params = {
      marker_id: markerId,
      value_id: valueId,
    };

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    return this.httpClient.put(this.api.getMarkerRoute(markerId), formdata, { headers: httpHeaders, params }).pipe(
      catchError(err => this.api.handleHttpError(err)),
      map((res: any) => this.parseMarkerValueResponse(res))
    );
  }

  getNotesForMarkerValue(contextId): Observable<any> {
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

  addMarkerToParagraph(path, name, paragraphId, markers, markerId, valueId) {
    if (!markerId || !valueId) {
      console.error('addMarkerToParagraph was called with invalid data, aborting');
      return;
    }
    const newMarker: Marker = {
      id: markerId,
      valueId,
    };
    const newMarkers = [...markers, newMarker];
    console.log('calling setParMeta with', path, name, paragraphId, 'markers', newMarkers);
    return this.paragraphService
      .setParagraphMeta(path, name, paragraphId, 'markers', newMarkers)
      .pipe(tap(res => console.log('got back res from setPara with markers', res)));
  }

  removeMarkerFromParagraph(path, name, paragraphId, markers, markerId) {
    if (!markerId) {
      console.error('removeMarkerFromParagraph was called with invalid data, aborting');
      return;
    }
    const indexToRemove = (markers || []).findIndex(m => m.id === markerId);
    if (indexToRemove === -1) {
      console.warn('removeMarkerFromParagraph could not find item to remove, do nothing', markers, markerId);
      return;
    }
    const updatedMarkers = [...markers];
    updatedMarkers.splice(indexToRemove, 1);
    console.log('calling setParMeta with', path, name, paragraphId, 'markers', updatedMarkers);
    return this.paragraphService
      .setParagraphMeta(path, name, paragraphId, 'markers', updatedMarkers)
      .pipe(tap(res => console.log('got back res from setPara with markers', res)));
  }

  saveMarkersForParagraph(path, name, paragraphId, markers) {
    if (!markers) {
      console.error('saveMarkersForParagraph was called with invalid data, aborting');
      return;
    }
    console.log('calling setParMeta with', path, name, paragraphId, 'markers', markers);
    return this.paragraphService
      .setParagraphMeta(path, name, paragraphId, 'markers', markers)
      .pipe(tap(res => console.log('got back res from setPara with markers', res)));
  }

  private parseMarkerValueResponse(res) {
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
