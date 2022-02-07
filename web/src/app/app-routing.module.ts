import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then((m) => m.ProjectsModule) },
  {
    path: 'projects/:project',
    loadChildren: () => import('./pages/project-details/project-details.module').then((m) => m.ProjectDetailsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
