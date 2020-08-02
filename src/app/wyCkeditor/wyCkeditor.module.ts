import { CkeditorComponent } from '@writerey/ckeditor/components/ckeditor/ckeditor.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const declarateAndExport = [CkeditorComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...declarateAndExport],
  exports: [...declarateAndExport],
})
export class WyCkeditorModule {}
