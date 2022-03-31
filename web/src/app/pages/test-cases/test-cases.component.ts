import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/types/issue';

@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss'],
})
export class TestCasesComponent implements OnInit, OnDestroy {
  sub!: Subscription;

  issues: Issue[] = [];

  constructor(private api: ApiService, private issueService: IssueService) {}

  private getBoardIssues() {
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getBoardIssues();
  }
}
