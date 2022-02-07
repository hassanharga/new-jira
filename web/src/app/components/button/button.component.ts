import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() label = 'OK';
  @Input() icon = '';
  @Input() className = 'p-button-text';
  @Input() disabled = false;
  @Output() handleClick = new EventEmitter();

  constructor() {}

  clickButton() {
    this.handleClick.emit();
  }

  ngOnInit(): void {}
}
