import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestModulesRoutingModule } from './test-modules-routing.module';
import { TestModulesComponent } from './test-modules.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [TestModulesComponent],
  imports: [CommonModule, TestModulesRoutingModule, ComponentsModule, AccordionModule],
})
export class TestModulesModule {}
