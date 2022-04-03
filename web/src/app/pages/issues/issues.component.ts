import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Issue } from 'src/app/types/issue';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss'],
})
export class IssuesComponent implements OnInit, OnDestroy {
  issue: Issue | null = null;

  sub!: Subscription;

  constructor(private activeRoute: ActivatedRoute, private api: ApiService) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.activeRoute.queryParams
      .pipe(
        switchMap(({ issue }) => {
          if (!issue) return EMPTY;
          return this.api.send<Issue>('getIssueDetails', { id: issue });
        }),
      )
      .subscribe({
        next: (issue) => (this.issue = issue),
      });
  }
}
