import { LabelDetailsComponent } from './labels/components/labelDetails/labelDetails.component';
import { DocumentEditorComponent } from './documents/components/documentEditor/documentEditor.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DocumentEditorComponent,
  },
  {
    path: 'labelDefinition',
    component: LabelDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
