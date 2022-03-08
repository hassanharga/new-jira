import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { Board } from 'src/app/types/board';
import { Project } from 'src/app/types/project';
import { MessageService } from 'primeng/api';
import { IssueService } from 'src/app/services/issue.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  projectId = '';
  boards: Board[] = [];
  selectedBoard: Board | null = null;
  isLoading = false;
  showModal = false;

  sub!: Subscription;

  links = [
    {
      name: this.translate.getTranslatedWrods('boards.links.roadmap'),
      link: 'roadmap',
    },
    {
      name: this.translate.getTranslatedWrods('boards.links.backlog'),
      link: 'backlog',
    },
    {
      name: this.translate.getTranslatedWrods('boards.links.board'),
      link: 'board',
    },
    {
      name: this.translate.getTranslatedWrods('boards.links.features'),
      link: 'features',
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private translate: LocalizationService,
    private messageService: MessageService,
    private issueService: IssueService,
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.project = state?.['data'] || null;
  }

  changeBoard(board: Board) {
    this.selectedBoard = board;
    this.issueService.setBoard(this.selectedBoard);
  }

  handelModal({ data, close }: { data?: any; close: boolean }) {
    if (data) {
      this.addBoard(data);
      return;
    }
    this.showModal = !close;
  }

  private addBoard(data: { data?: any; close: boolean }) {
    this.api.send<Board>('addBoard', { ...data, project: this.projectId }).subscribe({
      next: (board) => {
        if (this.boards.length === 0) {
          this.selectedBoard = board;
        }
        this.boards.push(board);
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

  private getProjectBoards() {
    this.sub = this.activatedRoute.params
      .pipe(
        switchMap(({ project }) => {
          if (!project) return EMPTY;
          this.projectId = project;
          this.issueService.setProjectId(project);
          return this.api.send<Board[]>('getProjectBoards', { project: this.projectId });
        }),
      )
      .subscribe({
        next: (res) => {
          this.boards = res;
          if (res && res.length > 0) {
            this.project = this.project ? this.project : this.boards[0].project;
            this.selectedBoard = this.boards[0];
            this.issueService.setProject(this.project);
            this.issueService.setBoard(this.selectedBoard);
          }
        },
      });
  }

  ngOnInit() {
    this.getProjectBoards();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
