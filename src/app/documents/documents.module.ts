/**
 * Copyright (c) 2020 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordCountComponent } from './components/wordCount/wordCount.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { WyCkeditorModule } from '@writerey/ckeditor/wyCkeditor.module';
import { DocumentEditorComponent } from './components/documentEditor/documentEditor.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const materialModules = [MatIconModule, MatProgressBarModule];
const declarationsAndExport = [WordCountComponent, IntroductionComponent, DocumentEditorComponent];

@NgModule({
  imports: [CommonModule, SharedModule, WyCkeditorModule, ...materialModules],
  declarations: [...declarationsAndExport],
  exports: [...declarationsAndExport],
})
export class DocumentsModule {}
