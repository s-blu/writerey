import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
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
    const findLinkOrCreateNewOne = links => {
      let link = links.find(l => l.path === path && l.name === name);
      if (!link) {
        const newLink = {
          linkId: uuid.v4(),
          name,
          path,
        } as DocumentLink;
        link = newLink;
        return this.saveNewLink(project, newLink);
      } else {
        return of(link);
      }
    };
    if (!project || !name || !path) return of(null);
    return this.getLinksForProject(project, findLinkOrCreateNewOne);
  }

  getDocumentInfoForLink(project: string, linkId: string) {
    if (!linkId || !project) return of(null);
    const findLinkWithId = links => {
      let link = links.find(l => l.linkId === linkId);
      return of(link);
    };

    return this.getLinksForProject(project, findLinkWithId);
  }

  moveLinkDestination(project: string, oldName: string, oldPath: string, newName: string, newPath: string) {
    if (!project || !oldName || !oldPath) {
      console.error('linkService -> moveLinkDestination was called with invalid data. Aborting.');
      return;
    }

    const replaceNameAndPathForLink = links => {
      let link = links.find(l => l.path === oldPath && l.name === oldName);
      if (!link) {
        // if there is no link available, all is good, no renaming is necessary;
        return of(null);
      } else {
        link.name = newName || oldName;
        link.path = newPath || oldPath;
        return this.saveLinksToServer(project, links);
      }
    };

    return this.getLinksForProject(project, replaceNameAndPathForLink);
  }

  private getLinksForProject(project, callbackFn) {
    if (!project || !callbackFn) return of(null);
    let linksForProjectObservable;

    if (!this.linkMap[project]) {
      linksForProjectObservable = this.httpClient.get(this.api.getLinkRoute(project)).pipe(
        map((res: any) => {
          this.saveServerResponseToLinkMap(project, res);
          return this.linkMap[project];
        }),
        flatMap((links: Array<DocumentLink>) => {
          return callbackFn(links);
        })
      );
    } else {
      linksForProjectObservable = callbackFn(this.linkMap[project]);
    }

    return linksForProjectObservable;
  }

  private saveNewLink(project, newLink) {
    let links = this.linkMap[project];

    if (!links) {
      console.error(
        'wanted to save new link but didnt get a map for project? will work with empty array',
        project,
        this.linkMap
      );
      links = [];
    }
    links.push(newLink);

    return this.saveLinksToServer(project, links).pipe(map(_ => newLink));
  }

  private saveLinksToServer(project, links) {
    const blob = new Blob([JSON.stringify(links)], { type: 'text/html' });
    const file = new File([blob], name, { type: 'text/html' });
    const formdata = new FormData();
    formdata.append('file', file);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');

    return this.httpClient.put(this.api.getLinkRoute(project), formdata, { headers: httpHeaders });
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
