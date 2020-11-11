import { LabelsComponent } from './labels/labels.component';
import { DocumentsFooterComponent } from './documents/components/documentsFooter/documentsFooter.component';
import { DocumentsComponent } from './documents/documents.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsTopbarComponent } from './documents/components/documentsTopbar/documentsTopbar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DocumentsFooterComponent,
        outlet: 'footer',
      },
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
        component: LabelsComponent,
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
