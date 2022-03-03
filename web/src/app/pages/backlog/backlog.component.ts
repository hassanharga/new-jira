import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { LocalizationService } from 'src/app/services/localization.service';
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

  boardId = '';

  showModal = true;

  constructor(
    private issueService: IssueService,
    private api: ApiService,
    private messageService: MessageService,
    private translate: LocalizationService,
  ) {}

  private getBacklogIssues() {
    this.sub = this.issueService
      .getBoard()
      .pipe(
        switchMap((board) => {
          if (!board) return EMPTY;
          this.boardId = board._id;
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

  addIssue({ data, close }: { data?: Partial<Issue>; close: boolean }) {
    if (!data) {
      this.showModal = !close;
      return;
    }
    if (!this.boardId) return;
    const payload = { ...data, board: this.boardId };
    this.api.send<Issue>('addIssue', payload).subscribe({
      next: (issue) => {
        this.issues.push(issue);
        this.showModal = !close;
      },
      error: ({ msg }) =>
        this.messageService.add({
          severity: 'error',
          summary: msg,
          detail: this.translate.getTranslatedWrods('general.error'),
        }),
    });
  }

  ngOnInit(): void {
    this.getBacklogIssues();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
