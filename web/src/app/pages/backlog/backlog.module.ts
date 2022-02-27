import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BacklogComponent } from './backlog.component';
import { BacklogRoutingModule } from './backlog-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [BacklogComponent],
  imports: [CommonModule, BacklogRoutingModule, ComponentsModule, TranslateModule.forChild(), ToastModule],
})
export class BacklogModule {}
