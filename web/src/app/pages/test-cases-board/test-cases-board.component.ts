import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { Issue, testIssueStatus, TestIssueStatusKeys } from 'src/app/types/issue';

@Component({
  selector: 'app-test-cases-board',
  templateUrl: './test-cases-board.component.html',
  styleUrls: ['./test-cases-board.component.scss'],
})
export class TestCasesBoardComponent implements OnInit, OnDestroy {
  sub!: Subscription;

  issues: Record<string, Issue[]> = {};
  unorderedIssues: Issue[] = [];

  testCaseIssue: Issue | null = null;

  projectId = '';

  showModal = false;

  boardIssueStatus: string[] = [
    TestIssueStatusKeys.todo,
    TestIssueStatusKeys.inProgress,
    TestIssueStatusKeys.success,
    TestIssueStatusKeys.failure,
  ];

  allIssueStatus = testIssueStatus;

  selectedIssue: Issue | null = null;
  showIssueModal = false;

  constructor(private api: ApiService, private issueService: IssueService) {}

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

  async updateIssueData(data: any) {
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

  openIssueModal(issue: Issue) {
    this.selectedIssue = issue;
    this.showIssueModal = true;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getProjectId() {
    const projectSub = this.issueService.getProjectId().subscribe({ next: (val) => (this.projectId = val) });
    this.sub.add(projectSub);
  }

  addIssue({ data, close }: { data?: Partial<Issue>; close: boolean }) {
    if (!data) {
      this.showModal = !close;
      return;
    }
    if (!this.projectId) return;
    const payload = {
      ...data,
      testCase: this.testCaseIssue?.testCase._id,
      board: this.testCaseIssue?.platform,
      createdByTestCase: true,
      project: this.projectId,
    };
    this.api.send<Issue>('addIssue', payload).subscribe({
      next: () => {
        this.testCaseIssue = null;
        this.showModal = !close;
      },
    });
  }

  addRelatedIssue({ issue }: { issue: Issue }) {
    this.testCaseIssue = issue;
    this.showIssueModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 20);
  }

  ngOnInit(): void {
    this.getBoardIssues();
    this.getProjectId();
  }
}
