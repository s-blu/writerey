// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from './api.service';
import { DirectoryService } from './directory.service';
import { DocumentService } from './document.service';
import { LabelService } from './label.service';
import { SnapshotService } from './snapshot.service';
import { WyInitService } from './wy-init.service';

class MockLabelService {
  init() {}
}
class MockSnapshotService {
  init() {}
}
class MockDocumentService {
  init() {}
}
class MockDirectoryService {
  init() {}
}
class MockMatIconRegistry {
  addSvgIcon() {}
}
class MockDomSanitizer {
  bypassSecurityTrustResourceUrl() {}
}
class MockApiService {
  getServerReadyRoute() {}
}

describe('Service: WyInit', () => {
  let wyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WyInitService,
        { provide: LabelService, useClass: MockLabelService },
        { provide: SnapshotService, useClass: MockSnapshotService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: DirectoryService, useClass: MockDirectoryService },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: DomSanitizer, useClass: MockDomSanitizer },
        { provide: ApiService, useClass: MockApiService },
      ],
    });
    wyService = TestBed.inject(WyInitService);
  });

  it('should ...', () => {
    expect(wyService).toBeTruthy();
  });
});
