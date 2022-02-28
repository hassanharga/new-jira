import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit, OnChanges {
  @Input() placeholder = '';
  @Input() icon = '';
  @Input() resetInput!: boolean;

  @Output() changeHandler = new EventEmitter<string>();

  value = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetInput']) {
      this.value = '';
    }
  }

  handleOnChange() {
    this.changeHandler.emit(this.value);
  }

  ngOnInit(): void {}
}
