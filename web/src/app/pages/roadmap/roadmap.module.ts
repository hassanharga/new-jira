import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoadmapRoutingModule } from './roadmap-routing.module';
import { RoadmapComponent } from './roadmap.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [RoadmapComponent],
  imports: [CommonModule, RoadmapRoutingModule, ComponentsModule, ToastModule],
})
export class RoadmapModule {}
