import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectTypes } from 'src/app/types/project';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent implements OnInit {
  @Input() showModal = false;
  @Output() addProject = new EventEmitter<{ data?: any; close: boolean }>();

  form!: FormGroup;

  pojectTypes = Object.values(ProjectTypes);

  constructor(private fb: FormBuilder) {}

  closeModal() {
    this.addProject.emit({ close: true });
  }

  onSubmit() {
    this.addProject.emit({ close: true, data: this.form.value });
  }

  get formData() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      key: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }
}
