import { MatFormFieldModule } from '@angular/material/form-field';
import { DocumentLabelsComponent } from './components/documentLabels/documentLabels.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@writerey/shared/shared.module';

const materialModules = [MatSelectModule, MatFormFieldModule];

@NgModule({
  imports: [FormsModule, SharedModule, CommonModule, ...materialModules],
  declarations: [DocumentLabelsComponent],
  exports: [DocumentLabelsComponent],
})
export class DocumentLabelsModule {}
