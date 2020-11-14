import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule),
  },
  {
    path: 'labelDefinition',
    loadChildren: () => import('./labels/labels.module').then(m => m.LabelsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
