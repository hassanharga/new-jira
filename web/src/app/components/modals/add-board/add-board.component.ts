import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardNames, BoardTypes } from 'src/app/types/board';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss'],
})
export class AddBoardComponent implements OnInit {
  @Input() showModal = false;
  @Output() addBoard = new EventEmitter<{ data?: any; close: boolean }>();

  form!: FormGroup;

  boardNames = Object.values(BoardNames);
  boardTypes = Object.values(BoardTypes);

  constructor(private fb: FormBuilder) {}

  closeModal() {
    this.addBoard.emit({ close: true });
  }

  onSubmit() {
    this.addBoard.emit({ close: true, data: this.form.value });
  }

  get formData() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }
}
