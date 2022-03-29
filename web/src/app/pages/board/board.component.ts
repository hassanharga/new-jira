import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, EMPTY } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { Issue, issueStatus, IssueStatusKeys } from 'src/app/types/issue';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  // issueStatusNames = [
  //   { name: IssueStatusKeys.todo, dragName: 'toDoDrap' },
  //   {
  //     name: IssueStatusKeys.inProgress,
  //     dragName: 'inProgressDrap',
  //     dropName: 'toDoDrap',
  //   },
  //   {
  //     name: IssueStatusKeys.inReview,

  //     dragName: 'inReviewDrap',
  //     dropName: 'inProgressDrap',
  //   },
  //   { name: IssueStatusKeys.done, dragName: 'doneDrap', dropName: 'inReviewDrap' },
  // ];

  boardIssueStatus: string[] = [IssueStatusKeys.todo, IssueStatusKeys.inProgress, IssueStatusKeys.inReview];
  allIssueStatus = issueStatus;

  issues: Record<string, Issue[]> = {};
  unorderedIssues: Issue[] = [];

  draggedIssue: Issue | null = null;

  selectedIssue: Issue | null = null;
  showIssueModal = false;

  sub!: Subscription;

  constructor(private issueService: IssueService, private api: ApiService, private activeRoute: ActivatedRoute) {}

  // dragStart(event: any, issue: Issue) {
  //   // console.log('event', event);
  //   console.log('issue', issue);
  //   this.draggedIssue = issue;
  // }

  // drop(event: any, status: string) {
  //   console.log('event', event);
  //   if (!this.draggedIssue) return;
  //   console.log('status', status);
  //   const draggedProductIndex = this.issues[status].findIndex((ele) => ele._id === this.draggedIssue?._id);
  //   let newStatus = '';
  //   if (status === IssueStatusKeys.todo) {
  //     newStatus = IssueStatusKeys.inProgress;
  //   } else if (status === IssueStatusKeys.inProgress) {
  //     newStatus = IssueStatusKeys.inReview;
  //   } else if (status === IssueStatusKeys.inReview) {
  //     newStatus = IssueStatusKeys.done;
  //   }
  //   this.issues[newStatus] = [...this.issues[status], this.draggedIssue];
  //   // this.issues[status].filter((val, i) => i != draggedProductIndex);
  //   this.draggedIssue = null;
  // }

  // dragEnd(event: any) {
  //   // console.log('event', event);
  //   event.preventDefault();
  //   // this.draggedIssue = null;
  // }

  async updateIssueData(data: any) {
    console.log('updateIssueData', data);
    if (!this.selectedIssue || !this.selectedIssue._id) return;
    this.api.send<Issue>('updateIssue', { id: this.selectedIssue?._id, ...data }).subscribe({
      next: (issue) => {
        this.selectedIssue = issue;
        const issueIdx = this.unorderedIssues.findIndex((ele) => ele._id === issue._id);
        if (issueIdx >= 0) {
          this.unorderedIssues[issueIdx] = issue;
          this.filterIssues(this.unorderedIssues);
        }
      },
    });
  }

  private filterIssues(issues: Issue[]) {
    this.issues = issues.reduce((prev: Record<string, Issue[]>, curr) => {
      if (!prev[curr.status]) {
        prev[curr.status] = [curr];
      } else {
        prev[curr.status].push(curr);
      }
      return prev;
    }, {});
  }

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
          this.unorderedIssues = res;
          this.filterIssues(res);
        },
      });
  }

  openIssueModal(issue: Issue) {
    this.selectedIssue = issue;
    this.showIssueModal = true;
  }

  getSingleIssue() {
    const paramSub = this.activeRoute.queryParams
      .pipe(
        switchMap(({ issue }) => {
          if (!issue) return EMPTY;
          return this.api.send<Issue>('getIssueDetails', { id: issue });
        }),
      )
      .subscribe({
        next: (issue) => {
          this.selectedIssue = issue;
          this.showIssueModal = true;
        },
      });

    this.sub.add(paramSub);
  }

  ngOnInit(): void {
    this.getBoardIssues();
    this.getSingleIssue();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
