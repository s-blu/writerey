import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@writerey/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagDialogComponent } from './components/tagDialog/tagDialog.component';
import { MatInputModule } from '@angular/material/input';
import { NameSnapshotDialogComponent } from './components/nameSnapshotDialog/nameSnapshotDialog.component';
import { LastModifiedComponent } from './components/lastModified/lastModified.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const materialModules = [
  MatDialogModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatTooltipModule,
];

@NgModule({
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, ...materialModules],
  declarations: [TagDialogComponent, NameSnapshotDialogComponent, LastModifiedComponent],
  exports: [TagDialogComponent, NameSnapshotDialogComponent, LastModifiedComponent],
})
export class HistoryModule {}
