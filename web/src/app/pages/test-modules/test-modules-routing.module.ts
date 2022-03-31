import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestModulesComponent } from './test-modules.component';

const routes: Routes = [
  {
    path: '',
    component: TestModulesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestModulesRoutingModule {}
