import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentLabelsComponent } from './components/documentLabels/documentLabels.component';
import { SharedModule } from '@writerey/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { CreateNewLabelComponent } from './components/createNewLabel/createNewLabel.component';
import { MatCardModule } from '@angular/material/card';
import { LabelDetailsComponent } from './components/labelDetails/labelDetails.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const materialModules = [
  MatSelectModule,
  MatSliderModule,
  MatTooltipModule,
  MatCardModule,
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
];

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, CKEditorModule, ReactiveFormsModule, ...materialModules],
  declarations: [DocumentLabelsComponent, CreateNewLabelComponent, LabelDetailsComponent],
  exports: [DocumentLabelsComponent, CreateNewLabelComponent, LabelDetailsComponent],
})
export class LabelsModule {}
