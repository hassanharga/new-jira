import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropDownComponent implements OnInit, OnChanges {
  @Input() label!: string;
  @Input() optionValue!: string;
  @Input() defaultValue: any;
  @Input() placeholder!: string;
  @Input() options: any[] = [];
  @Input() filter!: boolean;
  @Input() filterBy!: string;

  @Output() changeOption = new EventEmitter();

  selectedOption: any;

  constructor() {}

  ngOnChanges(): void {
    if (this.defaultValue) {
      this.selectedOption = this.defaultValue;
    }
  }

  handleChange() {
    if (!this.selectedOption) return;
    this.changeOption.emit(this.selectedOption);
  }

  ngOnInit(): void {}
}
