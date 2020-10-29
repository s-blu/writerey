// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentStore } from '../stores/document.store';
import { ProjectStore } from '../stores/project.store';
import { ApiService } from './api.service';
import { DocumentService } from './document.service';
import { LinkService } from './link.service';
import { ParagraphService } from './paragraph.service';

class MockApiService {}
class MockParagraphService {}
class MockDocumentStore {}
class MockLinkService {}
class MockProjectStore {}
class MockMatSnackBar {}

describe('Service: Document', () => {
  let documentService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DocumentService,
        { provide: ApiService, useClass: MockApiService },
        { provide: ParagraphService, useClass: MockParagraphService },
        { provide: DocumentStore, useClass: MockDocumentStore },
        { provide: LinkService, useClass: MockLinkService },
        { provide: ProjectStore, useClass: MockProjectStore },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ],
    });

    documentService = TestBed.inject(DocumentService);
  });

  it('should ...', () => {
    expect(documentService).toBeTruthy();
  });
});
