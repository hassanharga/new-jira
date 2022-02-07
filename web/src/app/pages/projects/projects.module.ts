import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { TranslateModule } from '@ngx-translate/core';

import { ToastModule } from 'primeng/toast';

import { ComponentsModule } from 'src/app/components/components.module';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [ProjectsComponent],
  imports: [CommonModule, ProjectsRoutingModule, TranslateModule.forChild(), ComponentsModule, ToastModule],
  providers: [MessageService],
})
export class ProjectsModule {}
