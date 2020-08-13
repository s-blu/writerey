// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'wy-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent implements OnInit {
  public introduction;
  constructor(private transloco: TranslocoService, private http: HttpClient) {}

  ngOnInit() {
    const lang = this.transloco.getActiveLang();
    this.http.get(`assets/introduction_${lang}.html`, { responseType: 'text' }).subscribe((res: any) => {
      this.introduction = res || '';
    });
  }
}
