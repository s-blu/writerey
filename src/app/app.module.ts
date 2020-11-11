/**
 * Copyright (c) 2020 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ExplorerModule } from '@writerey/explorer/explorer.module';
import { SharedModule } from '@writerey/shared/shared.module';
import { TranslocoService } from '@ngneat/transloco';
import { DeleteConfirmationDialogComponent } from './components/deleteConfirmationDialog/deleteConfirmationDialog.component';
import { CreateNewItemDialogComponent } from './components/createNewItemDialog/createNewItemDialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TranslocoRootModule } from './transloco-root.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';

import { initializeApp, WyInitService } from './services/wy-init.service';
import { DistractionFreeModeComponent } from './components/distractionFreeMode/distractionFreeMode.component';
import { AboutDialogComponent } from './components/aboutDialog/aboutDialog.component';
import { HistoryModule } from './history/history.module';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';

const matModules = [
  MatFormFieldModule,
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatDividerModule,
  MatSidenavModule,
];
@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    FooterComponent,
    CreateNewItemDialogComponent,
    DeleteConfirmationDialogComponent,
    DistractionFreeModeComponent,
    AboutDialogComponent,
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
    HistoryModule,
    AppRoutingModule,
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
