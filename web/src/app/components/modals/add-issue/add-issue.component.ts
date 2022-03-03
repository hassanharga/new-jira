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

  description = '';

  constructor(private fb: FormBuilder) {}

  closeModal() {
    this.addIssue.emit({ close: true });
  }
  onSubmit() {
    if (this.form.valid) {
      const data = { ...this.form.value, description: this.description };
      // console.log('data', data);
      this.addIssue.emit({ close: true, data });
    }
  }

  get formData() {
    return this.form.controls;
  }
  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      components: [''],
      reporter: [''],
      assignee: [''],
      priority: ['', [Validators.required]],
      version: ['', [Validators.required]],
    });
  }

  handleDescription(val: string) {
    this.description = val;
  }

  ngOnInit(): void {
    this.initForm();
  }
}
