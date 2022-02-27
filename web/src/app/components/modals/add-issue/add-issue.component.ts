import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueComponents, IssuePriority, IssueType } from 'src/app/types/issue';

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.scss'],
})
export class AddIssueComponent implements OnInit {
  @Input() showModal = false;
  @Output() addIssue = new EventEmitter<{ data?: any; close: boolean }>();

  form!: FormGroup;

  issueTypes = Object.values(IssueType);
  issuePriority = Object.values(IssuePriority);
  components = Object.values(IssueComponents);

  constructor(private fb: FormBuilder) {}

  closeModal() {
    this.addIssue.emit({ close: true });
  }
  onSubmit() {
    if (this.form.valid) {
      this.addIssue.emit({ close: true, data: this.form.value });
    }
  }

  get formData() {
    return this.form.controls;
  }
  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: [''],
      components: [''],
      reporter: [''],
      assignee: [''],
      priority: ['', [Validators.required]],
      version: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }
}
