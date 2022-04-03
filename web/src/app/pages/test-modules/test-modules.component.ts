import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { Issue, IssueType } from 'src/app/types/issue';
import { TestModule } from 'src/app/types/module';
import { TestCase } from 'src/app/types/testCase';

@Component({
  selector: 'app-test-modules',
  templateUrl: './test-modules.component.html',
  styleUrls: ['./test-modules.component.scss'],
})
export class TestModulesComponent implements OnInit, OnDestroy {
  showModal = false;
  showTestCaseModal = false;
  showStartTestingModal = false;

  modules: TestModule[] = [];
  selectedModule: TestModule | null = null;
  selectedTestCase: TestCase | null = null;
  activeAccordionIndex = -1;
  project = '';

  relaseIssues: Issue[] = [];
  sub!: Subscription;

  constructor(private api: ApiService, private issueService: IssueService) {}

  getProjectModules() {
    this.issueService
      .getProjectId()
      .pipe(
        switchMap((project) => {
          if (!project) return EMPTY;
          this.project = project;
          return this.api.send<TestModule[]>('getProjectModules', { project });
        }),
      )
      .subscribe({
        next: (res) => (this.modules = res),
      });
  }

  addModule({ data, close }: { data?: Partial<TestModule>; close: boolean }) {
    if (!data) {
      this.showModal = !close;
      return;
    }
    if (!this.project) return;
    this.api.send<TestModule>('addModule', { ...data, project: this.project }).subscribe({
      next: (module) => {
        this.modules.push(module);
        this.showModal = !close;
      },
    });
  }

  addTestCaseModule({ data, close }: { data?: Partial<TestModule>; close: boolean }) {
    if (!data) {
      this.showTestCaseModal = !close;
      return;
    }
    if (!this.project) return;
    this.api
      .send<TestCase>('addTestCase', { ...data, project: this.project, module: this.selectedModule?._id })
      .subscribe({
        next: (testCase) => {
          this.modules[this.activeAccordionIndex].testCases.push(testCase);
          this.showTestCaseModal = !close;
        },
      });
  }

  addTestIssues({ data, close }: { data?: any; close: boolean }) {
    if (!data) {
      this.showStartTestingModal = !close;
      return;
    }
    if (!this.project) return;

    this.issueService
      .getBoard()
      .pipe(
        switchMap((board) => {
          if (!board) return EMPTY;
          return this.api.send<Issue[]>('addTestIssues', {
            ...data,
            project: this.project,
            board: board._id,
          });
        }),
      )
      .subscribe({
        next: () => {
          this.showStartTestingModal = !close;
        },
      });
  }

  onTabOpen(e: any) {
    this.activeAccordionIndex = e.index;
    this.selectedModule = this.modules[e.index];
  }

  openTestCase(testCase: TestCase) {
    if (this.selectedTestCase && this.selectedTestCase._id === testCase._id) {
      return;
    }
    this.selectedTestCase = testCase;
  }

  private getReleaseIssues() {
    this.sub = this.issueService
      .getProjectId()
      .pipe(
        switchMap((project) => {
          if (!project) return EMPTY;
          return this.api.send<Issue[]>('searchIssues', {
            allBoards: true,
            id: project,
          });
        }),
      )
      .subscribe({
        next: (res) => {
          this.relaseIssues = res;
        },
      });
  }

  ngOnInit(): void {
    this.getProjectModules();
    this.getReleaseIssues();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
