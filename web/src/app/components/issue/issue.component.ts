import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Issue, issueStatus } from 'src/app/types/issue';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss'],
})
export class IssueComponent implements OnInit, OnChanges {
  @Input() issue: Issue | null = null;
  @Input() fromBoard: boolean = false;
  @Output() updateIssue = new EventEmitter();

  options: { name: string; value: string }[] = [];
  selectedIssueStatus!: { name: string; value: string };

  comment = '';
  resetInput = false;

  constructor() {}

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
    this.updateIssue.emit({ comments: [{ comment: this.comment, user: '12345' }] });
    this.comment = '';
    this.resetInput = true;
  }

  changeOption(option: { name: string; value: string }) {
    this.selectedIssueStatus = option;
    this.updateIssue.emit({ status: option.value });
  }

  ngOnInit(): void {
    this.options = Object.entries(issueStatus).map(([key, value]) => ({ name: value, value: key }));
  }
}
