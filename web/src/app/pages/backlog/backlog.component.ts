import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/types/issue';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss'],
})
export class BacklogComponent implements OnInit, OnDestroy {
  issues: Issue[] = [];
  sub!: Subscription;
  selectedIssue: Issue | null = null;

  constructor(private issueService: IssueService, private api: ApiService) {}

  private getBacklogIssues() {
    this.sub = this.issueService
      .getBoard()
      .pipe(
        switchMap((board) => {
          if (!board) return EMPTY;
          return this.api.send<Issue[]>('getBoardIssues', { id: board._id });
        }),
      )
      .subscribe({
        next: (res) => {
          this.issues = res;
        },
      });
  }

  openIssue(issue: Issue) {
    if (this.selectedIssue && this.selectedIssue._id === issue._id) return;
    this.selectedIssue = issue;
  }

  ngOnInit(): void {
    this.getBacklogIssues();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
