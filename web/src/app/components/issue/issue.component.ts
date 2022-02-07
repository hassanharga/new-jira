import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Issue, issueStatus } from 'src/app/types/issue';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss'],
})
export class IssueComponent implements OnInit, OnChanges {
  @Input() issue: Issue | null = null;

  options: { name: string; value: string }[] = [];
  selectedIssueStatus!: { name: string; value: string };

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['issue'] && this.issue) {
      this.selectedIssueStatus = { name: issueStatus[this.issue.status], value: this.issue.status };
    }
  }

  changeOption(option: any) {
    console.log('option', option);
    this.selectedIssueStatus = option;
  }

  ngOnInit(): void {
    this.options = Object.entries(issueStatus).map(([key, value]) => ({ name: value, value: key }));
  }
}
