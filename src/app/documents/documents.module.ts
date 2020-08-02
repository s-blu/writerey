/**
 * Copyright (c) 2020 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from './../shared/shared.module';
import { BreadcrumbComponent } from '@writerey/documents/components/breadcrumb/breadcrumb.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';

const materialModules = [MatIconModule];

@NgModule({
  imports: [CommonModule, SharedModule, ...materialModules],
  declarations: [DocumentsComponent, BreadcrumbComponent],
  exports: [BreadcrumbComponent],
})
export class DocumentsModule {}
