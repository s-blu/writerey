import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentLabelsComponent } from './components/documentLabels/documentLabels.component';
import { SharedModule } from '@writerey/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

const materialModules = [MatFormFieldModule, MatSelectModule, MatSliderModule]

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ...materialModules
  ],
  declarations: [DocumentLabelsComponent],
  exports: [DocumentLabelsComponent]
})
export class LabelsModule { }
