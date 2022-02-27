import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { BoardRoutingModule } from './board-routing.module';

import { DragDropModule } from 'primeng/dragdrop';
import { DialogModule } from 'primeng/dialog';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, BoardRoutingModule, ComponentsModule, DragDropModule, DialogModule],
})
export class BoardsModule {}
