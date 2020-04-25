import { TranslocoService } from '@ngneat/transloco';
import { WordCountComponent } from './components/wordCount/wordCount.component';
import { ModeSwitcherComponent } from './components/modeSwitcher/modeSwitcher.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { NameSnapshotDialogComponent } from './components/nameSnapshotDialog/nameSnapshotDialog.component';
import { DeleteConfirmationDialogComponent } from './components/deleteConfirmationDialog/deleteConfirmationDialog.component';
import { CreateNewMarkerComponent } from './components/createNewMarker/createNewMarker.component';
import { MarkerTreeComponent } from './components/markerTree/markerTree.component';
import { DocumentTreeComponent } from './components/documentTree/documentTree.component';
import { QuillComponent } from './components/quill/quill.component';
import { CreateNewNoteComponent } from './components/createNewNote/createNewNote.component';
import { CheckForNameSafetyDirective } from './directives/checkForNameSafety.directive';
import { TagDialogComponent } from './components/tagDialog/tagDialog.component';
import { LastModifiedComponent } from './components/lastModified/lastModified.component';
import { CreateNewFileDialogComponent } from './components/createNewFileDialog/createNewFileDialog.component';
import { StripFileEndingPipe } from './pipes/stripFileEnding.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
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
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TranslocoRootModule } from './transloco-root.module';
import { AppComponent } from './app.component';
import { DocumentEditorComponent } from './components/documentEditor/documentEditor.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { NotesComponent } from './components/notes/notes.component';
import { NoteComponent } from './components/note/note.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DocumentMarksComponent } from './components/documentMarks/documentMarks.component';
import { FooterComponent } from './components/footer/footer.component';
import { QuillModule } from 'ngx-quill';

import { initializeApp, WyInitService } from './services/wy-init.service';
import { MarkerDetailsComponent } from './components/markerDetails/markerDetails.component';
import { DistractionFreeModeComponent } from './components/distractionFreeMode/distractionFreeMode.component';
import { AddClassesForDistractionStatesDirective } from './directives/addClassesForDistractionStates.directive';

const matModules = [
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatTreeModule,
  MatMenuModule,
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
  MatListModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [
    AppComponent,
    DocumentEditorComponent,
    TopbarComponent,
    ExplorerComponent,
    NotesComponent,
    NoteComponent,
    BreadcrumbComponent,
    DocumentMarksComponent,
    FooterComponent,
    StripFileEndingPipe,
    CreateNewFileDialogComponent,
    TagDialogComponent,
    LastModifiedComponent,
    CreateNewNoteComponent,
    CheckForNameSafetyDirective,
    QuillComponent,
    DocumentTreeComponent,
    MarkerTreeComponent,
    CreateNewMarkerComponent,
    MarkerDetailsComponent,
    DeleteConfirmationDialogComponent,
    NameSnapshotDialogComponent,
    ProjectsComponent,
    ModeSwitcherComponent,
    WordCountComponent,
    DistractionFreeModeComponent,
    AddClassesForDistractionStatesDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ...matModules,
    TranslocoRootModule,
    QuillModule.forRoot(),
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
