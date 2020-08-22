import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyCkeditorModule } from '@writerey/ckeditor/wyCkeditor.module';
import { SharedModule } from '@writerey/shared/shared.module';
import { ChooseFileForLinkDialogComponent } from './components/chooseFileForLinkDialog/chooseFileForLinkDialog.component';
import { ExplorerModule } from '@writerey/explorer/explorer.module';
import { MatButtonModule } from '@angular/material/button';
import { DocumentLinkComponent } from './components/documentLink/documentLink.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateNewLinkComponent } from './components/createNewLink/createNewLink.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatSelectModule,
  MatInputModule,
];
const declarationsAndExport = [DocumentLinkComponent, CreateNewLinkComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    WyCkeditorModule,
    CKEditorModule,
    ExplorerModule,
    ReactiveFormsModule,
    ...materialModules,
  ],
  declarations: [ChooseFileForLinkDialogComponent, ...declarationsAndExport],
  exports: [...declarationsAndExport],
})
export class NoteItemsModule {}
