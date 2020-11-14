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
import { DocumentNoteItemsComponent } from './components/documentNoteItems/documentNoteItems.component';
import { NoteItemsModule } from '@writerey/noteItems/noteItems.module';
import { DocumentsTopbarComponent } from './components/documentsTopbar/documentsTopbar.component';
import { DocumentLabelsModule } from './../documentLabels/documentLabels.module';
import { DocumentsComponent } from './documents.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { ModeSwitcherComponent } from './components/modeSwitcher/modeSwitcher.component';
import { HistoryModule } from './../history/history.module';
import { DocumentsFooterComponent } from './components/documentsFooter/documentsFooter.component';

const materialModules = [MatIconModule, MatProgressBarModule, MatButtonModule];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WyCkeditorModule,
    NoteItemsModule,
    DocumentLabelsModule,
    HistoryModule,
    DocumentsRoutingModule,
    ...materialModules,
  ],
  declarations: [
    WordCountComponent,
    IntroductionComponent,
    DocumentEditorComponent,
    DocumentNoteItemsComponent,
    DocumentsComponent,
    DocumentsTopbarComponent,
    DocumentsFooterComponent,
    ModeSwitcherComponent,
  ],
  exports: [
    IntroductionComponent,
    DocumentsComponent,
    DocumentEditorComponent,
    DocumentsTopbarComponent,
    DocumentsFooterComponent,
    ModeSwitcherComponent,
  ],
})
export class DocumentsModule {}
