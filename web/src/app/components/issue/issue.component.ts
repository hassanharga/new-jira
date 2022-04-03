import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssueService } from 'src/app/services/issue.service';
import { Issue, issueStatus, testIssueStatus } from 'src/app/types/issue';
import { User } from 'src/app/types/user';
import { escapeHtml } from 'src/app/utils/excapeHtml';

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

  users: User[] = [];
  sub!: Subscription;

  options: { name: string; value: string }[] = [];
  selectedIssueStatus!: { name: string; value: string };

  comment = '';
  resetInput = false;

  constructor(private issueService: IssueService) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['issue'] && this.issue) {
      this.selectedIssueStatus = { name: issueStatus[this.issue.status], value: this.issue.status };
    }
  }

  changeCommit(data: any) {
    this.comment = data;
    this.resetInput = false;
  }

  addComment() {
    // TODO change user
    this.updateIssue.emit({ comments: [{ comment: escapeHtml(this.comment), user: this.users[0]._id }] });
    this.comment = '';
    this.resetInput = true;
  }

  changeOption(option: { name: string; value: string }) {
    this.selectedIssueStatus = option;
    this.updateIssue.emit({ status: option.value });
  }

  addIssue() {
    console.log('add issue');
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
