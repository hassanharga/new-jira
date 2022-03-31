import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueService } from 'src/app/services/issue.service';
import { User } from 'src/app/types/user';
import { escapeHtml } from 'src/app/utils/excapeHtml';

@Component({
  selector: 'app-add-test-case',
  templateUrl: './add-test-case.component.html',
  styleUrls: ['./add-test-case.component.scss'],
})
export class AddTestCaseComponent implements OnInit {
  @Input() showModal = false;
  @Input() isRelease = false;

  @Output() addTestCase = new EventEmitter<{ data?: any; close: boolean }>();

  form!: FormGroup;

  users: User[] = [];

  description = '';
  attachments: { name: string; url: string }[] = [];

  isUploading = false;

  constructor(private fb: FormBuilder, private issueService: IssueService) {}

  closeModal() {
    this.addTestCase.emit({ close: true });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = {
        ...this.form.value,
        description: escapeHtml(this.description),
        attachments: this.attachments.map((ele) => ele.url),
      };

      this.addTestCase.emit({ close: true, data });
    }
  }

  get formData() {
    return this.form.controls;
  }

  handleAttahcments(e: any) {
    this.attachments.push(e);
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  handleDescription(val: string) {
    this.description = val;
  }

  getUsers() {
    this.issueService.getUsers().subscribe({
      next: (users) => (this.users = users),
    });
  }

  ngOnInit(): void {
    this.initForm();
    // this.getUsers();
  }
}
