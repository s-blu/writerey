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
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

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

import { TranslocoRootModule } from './transloco-root.module';
import { AppComponent } from './app.component';
import { DocumentEditorComponent } from './components/document-editor/document-editor.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { NotesComponent } from './components/notes/notes.component';
import { NoteComponent } from './components/note/note.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DocumentMarksComponent } from './components/document-marks/document-marks.component';
import { FooterComponent } from './components/footer/footer.component';
import { QuillModule } from 'ngx-quill';

import { initializeApp, WyInitService } from './services/wy-init.service';
import { MarkerDetailsComponent } from './components/markerDetails/markerDetails.component';

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
  MatTabsModule
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
    MarkerDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    BrowserAnimationsModule,
    ...matModules,
    TranslocoRootModule,
    QuillModule.forRoot(
      //config goes here
    )
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [WyInitService], multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

}

