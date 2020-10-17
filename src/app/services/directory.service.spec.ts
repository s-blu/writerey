import { HttpClientTestingModule } from '@angular/common/http/testing';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DirectoryStore } from '../stores/directory.store';
import { DocumentStore } from '../stores/document.store';
import { ProjectStore } from '../stores/project.store';
import { ApiService } from './api.service';
import { DirectoryService } from './directory.service';
import { LinkService } from './link.service';

class MockApiService {}
class MockProjectStore {}
class MockDirectoryStore {}
class MockDocumentStore {}
class MockLinkService {}
class MockMatSnackBar {}

describe('Service: Directory', () => {
  let directoryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DirectoryService,
        { provide: ApiService, useClass: MockApiService },
        { provide: ProjectStore, useClass: MockProjectStore },
        { provide: DirectoryStore, useClass: MockDirectoryStore },
        { provide: DocumentStore, useClass: MockDocumentStore },
        { provide: LinkService, useClass: MockLinkService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ],
    });

    directoryService = TestBed.inject(DirectoryService);
  });

  it('should ...', () => {
    expect(directoryService).toBeTruthy();
  });
});
