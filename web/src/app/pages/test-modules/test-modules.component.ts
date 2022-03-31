import { Component, OnInit } from '@angular/core';
import { EMPTY, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/types/issue';
import { Module } from 'src/app/types/module';
import { TestCase } from 'src/app/types/testCase';

@Component({
  selector: 'app-test-modules',
  templateUrl: './test-modules.component.html',
  styleUrls: ['./test-modules.component.scss'],
})
export class TestModulesComponent implements OnInit {
  showModal = false;
  showTestCaseModal = false;
  showStartTestingModal = false;

  modules: Module[] = [];
  selectedModule: Module | null = null;
  selectedTestCase: TestCase | null = null;
  activeAccordionIndex = -1;
  project = '';

  constructor(private api: ApiService, private issueService: IssueService) {}

  getProjectModules() {
    this.issueService
      .getProjectId()
      .pipe(
        switchMap((project) => {
          if (!project) return EMPTY;
          this.project = project;
          return this.api.send<Module[]>('getProjectModules', { project });
        }),
      )
      .subscribe({
        next: (res) => (this.modules = res),
      });
  }

  addModule({ data, close }: { data?: Partial<Module>; close: boolean }) {
    if (!data) {
      this.showModal = !close;
      return;
    }
    if (!this.project) return;
    this.api.send<Module>('addModule', { ...data, project: this.project }).subscribe({
      next: (module) => {
        this.modules.push(module);
        this.showModal = !close;
      },
    });
  }

  addTestCaseModule({ data, close }: { data?: Partial<Module>; close: boolean }) {
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

  ngOnInit(): void {
    this.getProjectModules();
  }
}
