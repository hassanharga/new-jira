import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-feature',
  templateUrl: './add-feature.component.html',
  styleUrls: ['./add-feature.component.scss'],
})
export class AddFeatureComponent implements OnInit {
  @Input() showModal = false;
  @Output() addFeature = new EventEmitter<{ data?: any; close: boolean }>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  closeModal() {
    this.addFeature.emit({ close: true });
  }

  onSubmit() {
    this.addFeature.emit({ close: true, data: this.form.value });
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
