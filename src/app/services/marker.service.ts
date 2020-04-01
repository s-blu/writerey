import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor() { }

  createNewMarkerCategory(name, type) {
    return of('not implemented yet')
  }

}
