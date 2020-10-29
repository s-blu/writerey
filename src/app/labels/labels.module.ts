import { UpsertLabelValueComponent } from './components/upsertLabelValue/upsertLabelValue.component';
import { LabelNoteItemsComponent } from './components/labelNoteItems/labelNoteItems.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentLabelsComponent } from './components/documentLabels/documentLabels.component';
import { SharedModule } from '@writerey/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { NoteItemsModule } from '@writerey/noteItems/noteItems.module';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const materialModules = [
  MatSelectModule,
  MatSliderModule,
  MatTooltipModule,
  MatCardModule,
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CKEditorModule,
    ReactiveFormsModule,
    NoteItemsModule,
    ...materialModules,
  ],
  declarations: [
    DocumentLabelsComponent,
    CreateNewLabelComponent,
    LabelDetailsComponent,
    LabelNoteItemsComponent,
    UpsertLabelValueComponent,
  ],
  exports: [DocumentLabelsComponent, CreateNewLabelComponent, LabelDetailsComponent, LabelNoteItemsComponent],
})
export class LabelsModule {}
