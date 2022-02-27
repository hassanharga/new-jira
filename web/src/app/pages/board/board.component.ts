import { Component, OnDestroy, OnInit } from '@angular/core';
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

  issueStatus: string[] = [IssueStatusKeys.todo, IssueStatusKeys.inProgress, IssueStatusKeys.inReview];

  issues: Record<string, Issue[]> = {};

  draggedIssue: Issue | null = null;

  selectedIssue: Issue | null = null;
  showIssueModal = false;

  sub!: Subscription;

  constructor(private issueService: IssueService, private api: ApiService) {}

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
          this.filterIssues(res);
        },
      });
  }

  openIssueModal(issue: Issue) {
    this.selectedIssue = issue;
    this.showIssueModal = true;
  }

  ngOnInit(): void {
    this.getBoardIssues();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
