import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IssueService } from 'src/app/services/issue.service';
import { Issue, IssueComponents, IssuePriority, IssueType } from 'src/app/types/issue';
import { User } from 'src/app/types/user';
import { escapeHtml } from 'src/app/utils/excapeHtml';

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.scss'],
})
export class AddIssueComponent implements OnInit {
  @Input() showModal = false;
  @Input() isRelease = false;
  @Input() relaseIssues: Issue[] = [];

  @Output() addIssue = new EventEmitter<{ data?: any; close: boolean }>();

  form!: FormGroup;

  issueTypes = Object.values(IssueType);
  issuePriority = Object.values(IssuePriority);
  components = Object.values(IssueComponents);

  users: User[] = [];

  description = '';

  constructor(private fb: FormBuilder, private issueService: IssueService) {}

  closeModal() {
    this.addIssue.emit({ close: true });
  }

  onSubmit() {
    if (this.form.valid) {
      let data = {
        ...this.form.getRawValue(),
        description: escapeHtml(this.description),
        components: this.form.value.components ? this.form.value.componentsÎ : [],
      };
      if (!this.isRelease) {
        const { version, ...payload } = data;
        data = { ...payload, releaseId: version };
      }
      this.addIssue.emit({ close: true, data });
    }
  }

  get formData() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: [{ value: this.isRelease ? IssueType.release : '', disabled: this.isRelease }, [Validators.required]],
      components: [''],
      reporter: [''],
      assignee: [''],
      priority: ['', [Validators.required]],
      version: ['', [Validators.required]],
      description: [''],
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
    this.getUsers();
    if (!this.isRelease) {
      this.issueTypes = this.issueTypes.filter((ele) => ele !== IssueType.release);
      this.relaseIssues = this.relaseIssues.filter((ele) => ele.type === IssueType.release);
    }
  }
}
