/**
 * Copyright (c) 2020 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from './../shared/shared.module';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordCountComponent } from './components/wordCount/wordCount.component';

const materialModules = [MatIconModule];
const declarationsAndExport = [BreadcrumbComponent, WordCountComponent];

@NgModule({
  imports: [CommonModule, SharedModule, ...materialModules],
  declarations: [...declarationsAndExport],
  exports: [...declarationsAndExport],
})
export class DocumentsModule {}
