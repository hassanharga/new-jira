import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestCasesRoutingModule } from './test-cases-routing.module';
import { TestCasesComponent } from './test-cases.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TestCasesComponent],
  imports: [CommonModule, TestCasesRoutingModule, ComponentsModule],
})
export class TestCasesModule {}
