import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { QuillComponent } from './quill/quill.component';
import { QuillModule } from 'ngx-quill';
import { SimplebarAngularModule } from 'simplebar-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    QuillComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SimplebarAngularModule,
    QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
