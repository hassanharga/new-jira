import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssuesRoutingModule } from './issues-routing.module';
import { IssuesComponent } from './issues.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [IssuesComponent],
  imports: [CommonModule, IssuesRoutingModule, ComponentsModule],
})
export class IssuesModule {}
