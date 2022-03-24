/**
 * Copyright (c) 2020 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslocoService } from '@ngneat/transloco';
import { ExplorerModule } from '@writerey/explorer/explorer.module';
import { SharedModule } from '@writerey/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutDialogComponent } from './components/aboutDialog/aboutDialog.component';
import { CreateNewItemDialogComponent } from './components/createNewItemDialog/createNewItemDialog.component';
import { DeleteConfirmationDialogComponent } from './components/deleteConfirmationDialog/deleteConfirmationDialog.component';
import { DistractionFreeModeComponent } from './components/distractionFreeMode/distractionFreeMode.component';
import { ExportDialogComponent } from './components/exportDialog/exportDialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { HistoryModule } from './history/history.module';
import { initializeApp, WyInitService } from './services/wy-init.service';
import { TranslocoRootModule } from './transloco-root.module';

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
  MatRadioModule,
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
    ExportDialogComponent,
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
