import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyCkeditorModule } from '@writerey/ckeditor/wyCkeditor.module';
import { SharedModule } from '@writerey/shared/shared.module';
import { ChooseFileForLinkDialogComponent } from './components/chooseFileForLinkDialog/chooseFileForLinkDialog.component';
import { ExplorerModule } from '@writerey/explorer/explorer.module';
import { MatButtonModule } from '@angular/material/button';

const materialModules = [MatButtonModule];
const declarationsAndExport = [ChooseFileForLinkDialogComponent];

@NgModule({
  imports: [CommonModule, SharedModule, WyCkeditorModule, ExplorerModule, ...materialModules],
  declarations: [...declarationsAndExport],
  exports: [...declarationsAndExport],
})
export class NoteItemsModule { }
