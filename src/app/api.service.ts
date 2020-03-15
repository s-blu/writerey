import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverAdress = 'http://localhost:5002';

  constructor() { }

  getDocumentRoute(docName) {
    return docName ? `${this.serverAdress}/doc/${docName}` : `${this.serverAdress}/doc`;
  }

}
