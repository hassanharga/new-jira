import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() placeholder = '';
  @Input() icon = '';

  @Output() changeHandler = new EventEmitter<string>();

  value = '';

  constructor() {}

  handleOnChange() {
    this.changeHandler.emit(this.value);
  }

  ngOnInit(): void {}
}
