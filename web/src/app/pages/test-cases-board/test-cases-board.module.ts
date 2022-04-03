import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestCasesBoardRoutingModule } from './test-cases-board-routing.module';
import { TestCasesBoardComponent } from './test-cases-board.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [TestCasesBoardComponent],
  imports: [CommonModule, TestCasesBoardRoutingModule, ComponentsModule, DialogModule],
})
export class TestCasesModule {}
