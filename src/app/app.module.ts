import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { QuillComponent } from './components/quill/quill.component';
import { QuillModule } from 'ngx-quill';
import { SimplebarAngularModule } from 'simplebar-angular';
import { HttpClientModule } from '@angular/common/http';
import { DocumentEditorComponent } from './components/document-editor/document-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CkeditorComponent } from './components/ckeditor/ckeditor.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { NotesComponent } from './components/notes/notes.component';
import { NoteComponent } from './components/note/note.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DocumentMarksComponent } from './components/document-marks/document-marks.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslocoRootModule } from './transloco-root.module';

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
      MatButtonModule,
      TranslocoRootModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
