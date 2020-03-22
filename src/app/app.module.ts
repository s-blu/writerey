import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { QuillComponent } from './quill/quill.component';
import { QuillModule } from 'ngx-quill';
import { SimplebarAngularModule } from 'simplebar-angular';
import { HttpClientModule } from '@angular/common/http';
import { DocumentEditorComponent } from './document-editor/document-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CkeditorComponent } from './ckeditor/ckeditor.component';
import { TopbarComponent } from './topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExplorerComponent } from './explorer/explorer.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './note/note.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DocumentMarksComponent } from './document-marks/document-marks.component';
import { FooterComponent } from './footer/footer.component';

//const MaterialModules = [MatIconModule];

@NgModule({
   declarations: [
      AppComponent,
      QuillComponent,
      DocumentEditorComponent,
      CkeditorComponent,
      TopbarComponent,
      ExplorerComponent,
      NotesComponent,
      NoteComponent,
      BreadcrumbComponent,
      DocumentMarksComponent,
      FooterComponent
   ],
   imports: [
      BrowserModule,
      QuillModule.forRoot(),
      HttpClientModule,
      SimplebarAngularModule,
      FormsModule,
      ReactiveFormsModule,
      CKEditorModule,
      BrowserAnimationsModule,
      MatIconModule,
      MatButtonModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
