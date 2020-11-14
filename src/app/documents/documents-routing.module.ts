import { DocumentsComponent } from './documents.component';
import { DocumentsFooterComponent } from './components/documentsFooter/documentsFooter.component';
import { DocumentsTopbarComponent } from './components/documentsTopbar/documentsTopbar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class DocumentsRoutingModule {}
