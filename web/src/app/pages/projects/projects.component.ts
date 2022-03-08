import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { Project } from 'src/app/types/project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

  headers: { field: string; key: string; header: string }[] = [
    { field: '', key: 'name', header: this.translate.getTranslatedWrods('projects.table.headers.name') },
    { field: '', key: 'key', header: this.translate.getTranslatedWrods('projects.table.headers.key') },
    { field: '', key: 'type', header: this.translate.getTranslatedWrods('projects.table.headers.type') },
    { field: 'name', key: 'lead', header: this.translate.getTranslatedWrods('projects.table.headers.lead') },
  ];

  showModal = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private translate: LocalizationService,
    private messageService: MessageService,
    private issueService: IssueService,
  ) {}

  handleRowData(data: Project) {
    this.issueService.setProject(data);
    this.router.navigate(['projects', data.id], { state: { data } });
  }

  searchProjects(value: string) {
    this.getProjects(value);
  }

  addProject({ data, close }: { data?: Partial<Project>; close: boolean }) {
    if (!data) {
      this.showModal = !close;
      return;
    }
    this.api.send<Project>('addProject', { ...data }).subscribe({
      next: (project) => {
        this.projects.push(project);
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

  private getProjects(value?: string) {
    const options: Record<string, any> = {};
    if (value) options['search'] = value;
    this.api.send<Project[]>('getProjects', options).subscribe({
      next: (data) => (this.projects = data),
    });
  }

  ngOnInit(): void {
    this.getProjects();
  }
}
