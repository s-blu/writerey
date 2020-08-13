
import { NgModule } from '@angular/core';

import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { ExplorerComponent } from './explorer.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { MatListModule } from '@angular/material/list';
import { DocumentTreeComponent } from './components/documentTree/documentTree.component';
import { LabelTreeComponent } from './components/labelTree/labelTree.component';
import { CreateNewDirOrFileComponent } from './components/createNewDirOrFile/createNewDirOrFile.component';
import { RenameItemDialogComponent } from './components/renameItemDialog/renameItemDialog.component';

const matModules = [
    MatTabsModule,
    MatTreeModule,
    MatMenuModule,
    MatIconModule,
    //MatListModule,
  /*MatButtonModule,
  MatTooltipModule,
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
  ],
  imports: [
    matModules
  ],
  exports: [
    ExplorerComponent,
  ]
})
export class ExplorerModule {}
