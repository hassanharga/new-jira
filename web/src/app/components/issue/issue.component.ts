import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IssueService } from 'src/app/services/issue.service';
import { Issue, issueStatus, IssueType, testIssueStatus } from 'src/app/types/issue';
import { User } from 'src/app/types/user';
import { escapeHtml } from 'src/app/utils/excapeHtml';

type UpdateIssueType = 'description' | 'comment';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss'],
})
export class IssueComponent implements OnInit, OnChanges, OnDestroy {
  @Input() issue: Issue | null = null;
  @Input() fromBoard: boolean = false;
  @Input() isTest: boolean = false;

  @Output() updateIssue = new EventEmitter();
  @Output() addRelatedIssue = new EventEmitter();

  users: User[] = [];
  sub!: Subscription;

  options: { name: string; value: string }[] = [];
  selectedIssueStatus!: { name: string; value: string };

  comment = '';
  resetInput = false;

  editDescription = false;
  description = '';

  constructor(private issueService: IssueService, private router: Router) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['issue'] && changes['issue'].currentValue) {
      this.issue = changes['issue'].currentValue;
      if (this.issue?.status) {
        this.selectedIssueStatus = { name: issueStatus[this.issue.status], value: this.issue.status };
      }
    }
  }

  changeCommit(data: any) {
    this.comment = data;
    this.resetInput = false;
  }

  changeOption(option: { name: string; value: string }) {
    this.selectedIssueStatus = option;
    this.updateIssue.emit({ status: option.value });
  }

  addIssue() {
    this.addRelatedIssue.emit({ type: IssueType.bug, issue: this.issue });
  }

  prepareEditIssue(type: UpdateIssueType) {
    if (!this.issue) return;
    if (type === 'description') {
      this.description = this.isTest ? this.issue?.testCase.description : this.issue?.description;
      this.editDescription = true;
    }
  }

  editIssue(type: UpdateIssueType) {
    switch (type) {
      case 'comment':
        // TODO change user
        this.updateIssue.emit({ comments: [{ comment: escapeHtml(this.comment), user: this.users[0]._id }] });
        this.cancelEdit('comment');
        break;
      case 'description':
        this.updateIssue.emit({ description: escapeHtml(this.description) });
        this.cancelEdit('description');
        break;
      default:
        break;
    }
  }

  cancelEdit(type: UpdateIssueType) {
    switch (type) {
      case 'comment':
        this.comment = '';
        this.resetInput = true;
        break;
      case 'description':
        this.description = '';
        this.editDescription = false;
        break;

      default:
        break;
    }
  }

  openIssueInNewWindow(issue: Issue) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/issues`], {
        queryParams: { issue: issue._id },
      }),
    );
    window.open(url, '_blank');
  }

  ngOnInit(): void {
    if (this.isTest) {
      this.options = Object.entries(testIssueStatus).map(([key, value]) => ({ name: value, value: key }));
    } else {
      this.options = Object.entries(issueStatus).map(([key, value]) => ({ name: value, value: key }));
    }
    this.sub = this.issueService.getUsers().subscribe({
      next: (users) => (this.users = users),
    });
  }
}
