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

@NgModule({
   declarations: [
      AppComponent,
      QuillComponent,
      DocumentEditorComponent,
      CkeditorComponent
   ],
   imports: [
      BrowserModule,
      QuillModule.forRoot(),
      HttpClientModule,
      SimplebarAngularModule,
      FormsModule,
      ReactiveFormsModule,
      CKEditorModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
