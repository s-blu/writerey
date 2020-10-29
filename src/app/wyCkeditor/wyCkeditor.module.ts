import { CkeditorComponent } from '@writerey/ckeditor/components/ckeditor/ckeditor.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CkeditorToolbarComponent } from './components/ckeditorToolbar/ckeditorToolbar.component';
import { CkeditorReadonlyComponent } from './components/ckeditorReadonly/ckeditorReadonly.component';

const declarateAndExport = [CkeditorComponent, CkeditorToolbarComponent, CkeditorReadonlyComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...declarateAndExport],
  exports: [...declarateAndExport],
})
export class WyCkeditorModule {}
