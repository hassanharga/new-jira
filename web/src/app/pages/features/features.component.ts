import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EMPTY, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { Feature } from 'src/app/types/feature';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  showModal = false;
  showFeatureModal = false;

  features: Feature[] = [];

  selectedFeature: Feature | null = null;
  project = '';

  constructor(
    private api: ApiService,
    private issueService: IssueService,
    private translate: LocalizationService,
    private messageService: MessageService,
  ) {}

  getProjectFeatures() {
    this.issueService
      .getProjectId()
      .pipe(
        switchMap((project) => {
          if (!project) return EMPTY;
          this.project = project;
          return this.api.send<Feature[]>('getProjectFeatures', { project });
        }),
      )
      .subscribe({
        next: (res) => (this.features = res),
      });
  }

  addFeature({ data, close }: { data?: Partial<Feature>; close: boolean }) {
    if (!data) {
      this.showModal = !close;
      return;
    }
    if (!this.project) return;
    this.api.send<Feature>('addFeature', { ...data, project: this.project }).subscribe({
      next: (project) => {
        this.features.push(project);
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

  updateFeature({ description, id, type }: any) {
    const data: Record<string, any> = {
      id: this.selectedFeature?._id,
    };
    if (description) {
      data['drafts'] = [
        {
          description,
          // TODO
          user: '62274cd79bee33b51a6584ee',
        },
      ];
    }
    if (type === 'draft') data['draftId'] = id;

    this.api.send<Feature>('updateFeature', data).subscribe({
      next: (res) => {
        this.selectedFeature = res;
        const featureIdx = this.features.findIndex((ele) => ele._id === res._id);
        this.features[featureIdx] = res;
      },
    });
  }

  openFeature(feature: Feature) {
    this.selectedFeature = feature;
    this.showFeatureModal = true;
  }

  ngOnInit(): void {
    this.getProjectFeatures();
  }
}
