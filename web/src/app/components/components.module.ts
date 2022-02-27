import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableComponent } from './table/table.component';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';
import { ImageModule } from 'primeng/image';

import { LoaderComponent } from './loader/loader.component';
import { DropDownComponent } from './drop-down/drop-down.component';
import { AddBoardComponent } from './modals/add-board/add-board.component';
import { ButtonComponent } from './button/button.component';
import { AddProjectComponent } from './modals/add-project/add-project.component';
import { InputComponent } from './input/input.component';
import { PadgeComponent } from './padge/padge.component';
import { IssueComponent } from './issue/issue.component';
import { AccordionComponent } from './accordion/accordion.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';

@NgModule({
  declarations: [
    TableComponent,
    LoaderComponent,
    DropDownComponent,
    AddBoardComponent,
    ButtonComponent,
    AddProjectComponent,
    InputComponent,
    PadgeComponent,
    IssueComponent,
    AccordionComponent,
    ImagePreviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TableModule,
    ProgressSpinnerModule,
    DropdownModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ChipModule,
    AccordionModule,
    ImageModule,
  ],
  exports: [
    TableComponent,
    LoaderComponent,
    DropDownComponent,
    AddBoardComponent,
    ButtonComponent,
    AddProjectComponent,
    InputComponent,
    PadgeComponent,
    IssueComponent,
    AccordionComponent,
    ImagePreviewComponent,
  ],
})
export class ComponentsModule {}
