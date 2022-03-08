import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from './project-details.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectDetailsComponent,
    children: [
      { path: '', redirectTo: 'backlog', pathMatch: 'full' },
      { path: 'board', loadChildren: () => import('../board/boards.module').then((m) => m.BoardsModule) },
      { path: 'backlog', loadChildren: () => import('../backlog/backlog.module').then((m) => m.BacklogModule) },
      { path: 'features', loadChildren: () => import('../features/features.module').then((m) => m.FeaturesModule) },
      { path: 'roadmap', loadChildren: () => import('../roadmap/roadmap.module').then((m) => m.RoadmapModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectDetailsRoutingModule {}
