import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueService } from 'src/app/services/issue.service';
import { IssueType } from 'src/app/types/issue';
import { Module, ModulePlatform } from 'src/app/types/module';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-add-test-issue',
  templateUrl: './add-test-issue.component.html',
  styleUrls: ['./add-test-issue.component.scss'],
})
export class AddTestIssueComponent implements OnInit {
  @Input() showModal = false;
  @Input() isRelease = false;
  @Input() modules: Module[] = [];

  @Output() addTestIssue = new EventEmitter<{ data?: any; close: boolean }>();

  form!: FormGroup;

  platform = Object.values(ModulePlatform);

  users: User[] = [];

  constructor(private fb: FormBuilder, private issueService: IssueService) {}

  closeModal() {
    this.addTestIssue.emit({ close: true });
  }

  onSubmit() {
    if (this.form.valid) {
      this.addTestIssue.emit({ close: true, data: { ...this.form.value, type: IssueType.test } });
    }
  }

  get formData() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.fb.group({
      platform: ['', [Validators.required]],
      modules: ['', [Validators.required]],
      reporter: ['', [Validators.required]],
      assignee: [''],
    });
  }

  getUsers() {
    this.issueService.getUsers().subscribe({
      next: (users) => (this.users = users),
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getUsers();
  }
}
