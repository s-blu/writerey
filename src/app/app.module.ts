import { CreateNewFileDialogComponent } from './components/createNewFileDialog/createNewFileDialog.component';
import { StripFileEndingPipe } from './pipes/stripFileEnding.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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


import { TranslocoRootModule } from './transloco-root.module';
import { AppComponent } from './app.component';
import { DocumentEditorComponent } from './components/document-editor/document-editor.component';
import { CkeditorComponent } from './components/ckeditor/ckeditor.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { NotesComponent } from './components/notes/notes.component';
import { NoteComponent } from './components/note/note.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DocumentMarksComponent } from './components/document-marks/document-marks.component';
import { FooterComponent } from './components/footer/footer.component';

const matModules = [MatIconModule, MatButtonModule, MatTooltipModule,
   MatTreeModule, MatMenuModule, MatProgressBarModule, MatDialogModule, MatInputModule, MatFormFieldModule];

@NgModule({
   declarations: [
      AppComponent,
      DocumentEditorComponent,
      CkeditorComponent,
      TopbarComponent,
      ExplorerComponent,
      NotesComponent,
      NoteComponent,
      BreadcrumbComponent,
      DocumentMarksComponent,
      FooterComponent,
      StripFileEndingPipe,
      CreateNewFileDialogComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      CKEditorModule,
      BrowserAnimationsModule,
      ...matModules,
      TranslocoRootModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
