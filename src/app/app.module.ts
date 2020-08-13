// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { IntroductionComponent } from './components/_documents/introduction/introduction.component';
import { CkeditorToolbarComponent } from './components/_documents/ckeditorToolbar/ckeditorToolbar.component';
import { CkeditorComponent } from './components/_documents/ckeditor/ckeditor.component';
import { DocumentLinkComponent } from './components/_notes/documentLink/documentLink.component';
import { NotesItemComponent } from './components/_notes/notesItem/notesItem.component';
import { ChooseFileForLinkDialogComponent } from './components/_notes/chooseFileForLinkDialog/chooseFileForLinkDialog.component';
import { CreateNewLinkComponent } from './components/_notes/createNewLink/createNewLink.component';
import { TranslocoService } from '@ngneat/transloco';
import { WordCountComponent } from './components/_documents/wordCount/wordCount.component';
import { ModeSwitcherComponent } from './components/modeSwitcher/modeSwitcher.component';
import { NameSnapshotDialogComponent } from './components/_snapshots/nameSnapshotDialog/nameSnapshotDialog.component';
import { DeleteConfirmationDialogComponent } from './components/deleteConfirmationDialog/deleteConfirmationDialog.component';
import { CreateNewLabelComponent } from './components/_labels/createNewLabel/createNewLabel.component';
import { UpsertNoteComponent } from './components/_notes/upsertNote/upsertNote.component';
import { TagDialogComponent } from './components/_snapshots/tagDialog/tagDialog.component';
import { LastModifiedComponent } from './components/lastModified/lastModified.component';
import { CreateNewItemDialogComponent } from './components/createNewItemDialog/createNewItemDialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TranslocoRootModule } from './transloco-root.module';
import { AppComponent } from './app.component';
import { DocumentEditorComponent } from './components/_documents/documentEditor/documentEditor.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotesComponent } from './components/_notes/notes/notes.component';
import { NoteComponent } from './components/_notes/note/note.component';
import { BreadcrumbComponent } from './components/_documents/breadcrumb/breadcrumb.component';
import { DocumentLabelsComponent } from './components/_labels/documentLabels/documentLabels.component';
import { FooterComponent } from './components/footer/footer.component';

import { initializeApp, WyInitService } from './services/wy-init.service';
import { LabelDetailsComponent } from './components/_labels/labelDetails/labelDetails.component';
import { DistractionFreeModeComponent } from './components/distractionFreeMode/distractionFreeMode.component';
import { MatDividerModule } from '@angular/material/divider';
import { CreateNewNotesItemComponent } from './components/_notes/createNewNotesItem/createNewNotesItem.component';
import { CreateNewLabelInfoComponent } from './components/_notes/createNewLabelInfo/createNewLabelInfo.component';
import { NoteItemCkeditorViewComponent } from './components/_notes/noteItemCkeditorView/noteItemCkeditorView.component';
import { ExplorerModule } from '@writerey/explorer/explorer.module';
import { SharedModule } from '@writerey/shared/shared.module';

const matModules = [
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatSelectModule,
  MatExpansionModule,
  MatCardModule,
  MatTabsModule,
  MatSliderModule,
  MatProgressSpinnerModule,
  MatDividerModule,
];

@NgModule({
  declarations: [
    AppComponent,
    DocumentEditorComponent,
    TopbarComponent,
    NotesComponent,
    NoteComponent,
    BreadcrumbComponent,
    DocumentLabelsComponent,
    FooterComponent,
    CreateNewItemDialogComponent,
    TagDialogComponent,
    LastModifiedComponent,
    UpsertNoteComponent,
    CreateNewLabelComponent,
    LabelDetailsComponent,
    DeleteConfirmationDialogComponent,
    NameSnapshotDialogComponent,
    ModeSwitcherComponent,
    WordCountComponent,
    DistractionFreeModeComponent,
    CreateNewNotesItemComponent,
    CreateNewLinkComponent,
    ChooseFileForLinkDialogComponent,
    NotesItemComponent,
    DocumentLinkComponent,
    CreateNewLabelInfoComponent,
    CkeditorComponent,
    CkeditorToolbarComponent,
    NoteItemCkeditorViewComponent,
    IntroductionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ...matModules,
    TranslocoRootModule,
    CKEditorModule,
    ExplorerModule,
    SharedModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [WyInitService], multi: true },
    {
      provide: LOCALE_ID,
      deps: [TranslocoService],
      useFactory: getLocaleId,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

function getLocaleId(transloco: TranslocoService) {
  return transloco.getActiveLang();
}
