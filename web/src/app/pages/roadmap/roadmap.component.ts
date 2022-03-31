import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, switchMap, EMPTY } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { Issue, IssueType } from 'src/app/types/issue';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss'],
})
export class RoadmapComponent implements OnInit, OnDestroy {
  issues: Issue[] = [];
  sub!: Subscription;
  selectedIssue: Issue | null = null;

  boardId = '';
  projectId = '';

  showModal = false;

  constructor(
    private issueService: IssueService,
    private api: ApiService,
    private messageService: MessageService,
    private translate: LocalizationService,
  ) {}

  async updateIssueData(data: any) {
    if (!this.selectedIssue || !this.selectedIssue._id) return;
    this.api.send<Issue>('updateIssue', { id: this.selectedIssue?._id, ...data }).subscribe({
      next: (issue) => {
        this.selectedIssue = issue;
        const issueIdx = this.issues.findIndex((ele) => ele._id === issue._id);
        if (issueIdx >= 0) {
          this.issues[issueIdx] = issue;
        }
      },
    });
  }

  private getBacklogIssues() {
    this.sub = this.issueService
      .getBoard()
      .pipe(
        switchMap((board) => {
          if (!board) return EMPTY;
          this.boardId = board._id;
          return this.api.send<Issue[]>('getBoardIssues', { id: board._id, type: IssueType.release });
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
    if (!this.boardId || !this.projectId) return;
    const payload = { ...data, board: this.boardId, project: this.projectId };
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

  getProjectId() {
    const projectSub = this.issueService.getProjectId().subscribe({ next: (val) => (this.projectId = val) });
    this.sub.add(projectSub);
  }

  ngOnInit(): void {
    this.getBacklogIssues();
    this.getProjectId();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
