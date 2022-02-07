import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectDetailsRoutingModule } from './project-details-routing.module';
import { ProjectDetailsComponent } from './project-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [ProjectDetailsComponent],
  imports: [CommonModule, ProjectDetailsRoutingModule, TranslateModule.forChild(), ComponentsModule, ToastModule],
  providers: [MessageService],
})
export class ProjectDetailsModule {}
