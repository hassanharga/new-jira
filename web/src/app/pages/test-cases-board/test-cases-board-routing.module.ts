import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestCasesBoardComponent } from './test-cases-board.component';

const routes: Routes = [
  {
    path: '',
    component: TestCasesBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCasesBoardRoutingModule {}
