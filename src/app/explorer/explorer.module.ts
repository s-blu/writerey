
import { NgModule } from '@angular/core';

import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExplorerComponent } from './explorer.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { MatListModule } from '@angular/material/list';
import { DocumentTreeComponent } from './components/documentTree/documentTree.component';
import { LabelTreeComponent } from './components/labelTree/labelTree.component';
import { CreateNewDirOrFileComponent } from './components/createNewDirOrFile/createNewDirOrFile.component';
import { RenameItemDialogComponent } from './components/renameItemDialog/renameItemDialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DocumentExplorerComponent } from './components/documentExplorer/documentExplorer.component';
import { FormsModule } from '@angular/forms';

const matModules = [
    MatTabsModule,
    MatTreeModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatTooltipModule,
  /*MatButtonModule,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  ,
  MatProgressBarModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatSelectModule,
  MatExpansionModule,
  MatCardModule,
  ,
  MatSliderModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatDividerModule,*/
];

@NgModule({
  declarations: [
    ExplorerComponent,
    ProjectsComponent,
    LabelTreeComponent,
    CreateNewDirOrFileComponent,
    DocumentTreeComponent,    
    RenameItemDialogComponent,
    DocumentExplorerComponent,
  ],
  imports: [
    matModules,
    FormsModule,
  ],
  exports: [
    ExplorerComponent,
    DocumentTreeComponent,
  ]
})
export class ExplorerModule {}
