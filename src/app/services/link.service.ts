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

  getLinkForDocument(name, path, project) {
    const _findLinkOrCreateNewOne = links => {
      let link = links.find(l => l.path === path && l.name === name);
      if (!link) {
        const newLink = {
          linkId: uuid.v4(),
          name,
          path,
        } as DocumentLink;
        link = newLink.linkId;
        return this.saveNewLink(project, newLink);
      } else {
        return of(link);
      }
    };
    if (!project || !name || !path) return of(null);
    let linkMapObservable;

    if (!this.linkMap[project]) {
      linkMapObservable = this.httpClient.get(this.api.getLinkRoute(project)).pipe(
        map((res: any) => {
          this.saveServerResponseToLinkMap(project, res);
          return this.linkMap[project];
        }),
        flatMap((links: Array<DocumentLink>) => {
          return _findLinkOrCreateNewOne(links);
        })
      );
    } else {
      linkMapObservable = _findLinkOrCreateNewOne(this.linkMap[project]);
    }

    return linkMapObservable;
  }

  private saveNewLink(project, newLink) {
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

    const blob = new Blob([JSON.stringify(links)], { type: 'text/html' });
    const file = new File([blob], name, { type: 'text/html' });
    const formdata = new FormData();
    formdata.append('file', file);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient
      .put(this.api.getLinkRoute(project), formdata, { headers: httpHeaders })
      .pipe(map(_ => newLink.linkId));
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
