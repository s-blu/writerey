import { LabelNoteItemsComponent } from './labels/components/labelNoteItems/labelNoteItems.component';
import { DocumentNoteItemsComponent } from './documents/components/documentNoteItems/documentNoteItems.component';
import { LabelDetailsComponent } from './labels/components/labelDetails/labelDetails.component';
import { DocumentEditorComponent } from './documents/components/documentEditor/documentEditor.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DocumentNoteItemsComponent,
        outlet: 'notes',
      },
      {
        path: '',
        component: DocumentEditorComponent,
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
