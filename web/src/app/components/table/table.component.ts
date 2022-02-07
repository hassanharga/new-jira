import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columns: { key: string; header: string }[] = [];
  @Input() data: any[] = [];
  @Input() caption: string = '';

  @Output() rowClick = new EventEmitter();

  constructor() {}

  handleRowData(row: any) {
    this.rowClick.emit(row);
  }

  ngOnInit(): void {}
}
