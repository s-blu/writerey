import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';
import * as uuid from 'uuid';

interface DocumentLink {
  linkId: string;
  path: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private linkMap = {};
  constructor(private httpClient: HttpClient, private api: ApiService) {}

  getLinkForDocument(project, node) {
    // TODO dont get node but name and path
    console.log('getLinkForDocument ', project, node);
    if (!project || !node) return of(null);
    let linkMapObservable;
    if (!this.linkMap[project]) {
      linkMapObservable = this.httpClient.get(this.api.getLinkRoute(project)).pipe(
        flatMap((res: any) => {
          this.saveServerResponseToLinkMap(project, res);
          console.log('got response from server to save to linkMap', this.linkMap[project]);
          return this.linkMap[project];
        })
      );
    } else {
      linkMapObservable = of(this.linkMap[project]);
    }

    return linkMapObservable.pipe(
      map((links: Array<DocumentLink>) => {
        console.log('try to find link', links, node);
        let linkId = links.find(l => l.path === node.path && l.name === node.name)?.linkId;
        if (!linkId) {
          console.log('have no link, generate a new one');
          const newLink = {
            linkId: uuid.v4(),
            name: node.name,
            path: node.path,
          } as DocumentLink;
          linkId = newLink.linkId;
          return this.saveNewLink(project, newLink);
        } else {
          return linkId;
        }
      })
    );
  }

  private saveNewLink(project, newLink) {
    console.log('saving new link', project, newLink);
    let links = this.linkMap[project];

    if (!links) {
      // todo
      console.error(
        'wanted to save new link but didnt get a map for project? will work with empty array',
        project,
        this.linkMap
      );
      links = [];
    }
    links.push(newLink);

    const blob = new Blob([links], { type: 'text/html' });
    const file = new File([blob], name, { type: 'text/html' });
    const formdata = new FormData();
    formdata.append('file', file);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient
      .put(this.api.getLinkRoute(project), formdata, { headers: httpHeaders })
      .pipe(flatMap(_ => newLink.linkId));
  }

  private saveServerResponseToLinkMap(project, res) {
    try {
      if (res !== '') {
        res = JSON.parse(res);
        this.linkMap[project] = res;
      } else {
        this.linkMap[project] = [];
      }
    } catch (e) {
      console.warn('getLinkForDocument: could not read answer from server. Setting to empty map.');
      this.linkMap[project] = [];
    }
  }
}
