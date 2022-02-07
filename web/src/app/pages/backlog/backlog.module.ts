import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BacklogComponent } from './backlog.component';
import { BacklogRoutingModule } from './backlog-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [BacklogComponent],
  imports: [CommonModule, BacklogRoutingModule, ComponentsModule],
})
export class BacklogModule {}
