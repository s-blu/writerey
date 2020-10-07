import { DocumentsComponent } from './documents/documents.component';
import { LabelNoteItemsComponent } from './labels/components/labelNoteItems/labelNoteItems.component';
import { DocumentNoteItemsComponent } from './documents/components/documentNoteItems/documentNoteItems.component';
import { LabelDetailsComponent } from './labels/components/labelDetails/labelDetails.component';
import { DocumentEditorComponent } from './documents/components/documentEditor/documentEditor.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsTopbarComponent } from './documents/components/documentsTopbar/documentsTopbar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DocumentsTopbarComponent,
        outlet: 'topbar',
      },
      {
        path: '',
        component: DocumentsComponent,
      },
    ],
  },
  {
    path: 'labelDefinition',
    children: [
      {
        path: '',
        component: LabelDetailsComponent,
      },
      {
        path: '',
        component: LabelNoteItemsComponent,
        outlet: 'notes',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
