import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss'],
})
export class AddModuleComponent implements OnInit {
  @Input() showModal = false;
  @Output() addModule = new EventEmitter<{ data?: any; close: boolean }>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  closeModal() {
    this.addModule.emit({ close: true });
  }

  onSubmit() {
    this.addModule.emit({ close: true, data: this.form.value });
  }

  get formData() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }
}
