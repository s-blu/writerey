import { NgModule, LOCALE_ID } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { SharedModule } from '@writerey/shared/shared.module';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoRootModule } from '../transloco-root.module';
import { MatButtonModule } from '@angular/material/button';

const matModules = [
    MatTabsModule,
    MatTreeModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatTooltipModule,
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
    CommonModule,
    SharedModule,
    TranslocoRootModule,
  ],
  exports: [
    ExplorerComponent,
    DocumentTreeComponent,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [TranslocoService],
      useFactory: getLocaleId,
    },
  ],
})
export class ExplorerModule {}

function getLocaleId(transloco: TranslocoService) {
  return transloco.getActiveLang();
}
