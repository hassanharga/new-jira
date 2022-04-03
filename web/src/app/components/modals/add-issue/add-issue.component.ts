import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
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
  @Input() isTestIssue = false;
  @Input() issue: Issue | null = null;
  @Input() relaseIssues: Issue[] = [];
  @Input() searchedIssues: Issue[] = [];

  @Output() addIssue = new EventEmitter<{ data?: any; close: boolean }>();
  @Output() filterIssues = new EventEmitter<string>();

  form!: FormGroup;

  issueTypes = Object.values(IssueType).filter((ele) => ele !== IssueType.test);
  issuePriority = Object.values(IssuePriority);
  components = Object.values(IssueComponents);

  users: User[] = [];

  description = '';
  attachments: string[] = [];

  isUploading = false;

  constructor(private fb: FormBuilder, private issueService: IssueService, private api: ApiService) {}

  closeModal() {
    this.addIssue.emit({ close: true });
  }

  onSubmit() {
    if (!this.form.valid) return;
    let data = {
      ...this.form.getRawValue(),
      description: escapeHtml(this.description),
      components: this.form.value.components ? this.form.value.components : [],
      attachments: this.attachments.map((ele) => ele.split('?')[0]),
      linkedIssues: this.isTestIssue
        ? [this.issue?._id]
        : this.form.controls['linkedIssues'].value
        ? this.form.controls['linkedIssues'].value.map((ele: Issue) => ele._id)
        : [],
    };
    if (!this.isRelease) {
      const { version, ...payload } = data;
      data = { ...payload, releaseId: version };
    }
    this.addIssue.emit({ close: true, data });
  }

  get formData() {
    return this.form.controls;
  }

  async handleAttahcments(e: any) {
    const url = await lastValueFrom(this.api.send<string>('signUrl', { url: e.url }));
    this.attachments.push(url);
  }

  deleteAttahcments(e: any) {
    this.attachments.splice(e, 1);
  }

  initForm() {
    this.form = this.fb.group({
      name: [this.issue?.name || '', [Validators.required]],
      type: [
        {
          value: this.isRelease ? IssueType.release : this.isTestIssue ? IssueType.bug : '',
          disabled: this.isRelease || this.isTestIssue,
        },
        [Validators.required],
      ],
      components: [''],
      linkedIssues: [''],
      reporter: [this.isTestIssue ? this.issue?.assignee?._id : ''],
      assignee: [''],
      priority: ['', [Validators.required]],
      version: [''],
      cbuNumber: [''],
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

  searchLinkedIssues(e: any) {
    this.filterIssues.emit(e.filter);
  }

  // changeIssues(e: any) {
  //   console.log('changeIssues', e);
  //   this.linkedIssues.push(e);
  // }

  ngOnInit(): void {
    this.initForm();
    this.getUsers();
    if (!this.isRelease) {
      this.issueTypes = this.issueTypes.filter((ele) => ele !== IssueType.release);
      this.relaseIssues = this.relaseIssues.filter((ele) => ele.type === IssueType.release);
    }
  }
}
