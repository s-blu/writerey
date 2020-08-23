import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@writerey/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TagDialogComponent } from './components/tagDialog/tagDialog.component';
import { MatInputModule } from '@angular/material/input';

const materialModules = [MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  declarations: [TagDialogComponent],
  exports: [TagDialogComponent]
})
export class HistoryModule { }
