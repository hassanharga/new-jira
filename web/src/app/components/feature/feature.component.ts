import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Feature, FeatureHistory } from 'src/app/types/feature';
import { Issue } from 'src/app/types/issue';
import { escapeHtml } from 'src/app/utils/excapeHtml';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent implements OnInit, OnChanges {
  @Input() feature: Feature | null = null;
  @Input() resetDraft = false;
  @Input() releases: Issue[] = [];
  @Output() editFeature = new EventEmitter();

  items!: MenuItem[];
  activeItem!: MenuItem;

  productionHistoy: FeatureHistory[] = [];
  draftsHistoy: FeatureHistory[] = [];

  dropDownOptions: FeatureHistory[] = [];

  selectedDraft: FeatureHistory | null = null;

  showEditInput = false;
  description = '';
  editedDescription = '';
  release = '';

  attachments: string[] = [];
  uxAttachments: string[] = [];

  isUploading = false;

  constructor(private datePipe: DatePipe, private api: ApiService) {}

  editPage() {
    if (this.showEditInput) {
      if (!this.release) return;
      this.editFeature.emit({
        description: escapeHtml(this.description),
        release: this.release,
        attachments: this.attachments.map((ele) => ele.split('?')[0]),
        uxAttachments: this.uxAttachments.map((ele) => ele.split('?')[0]),
      });
    } else {
      this.description = '';
      const newestHistory = this.feature?.history.pop();
      if (newestHistory) {
        this.editedDescription = newestHistory.description;
        this.attachments = newestHistory.attachments;
        this.uxAttachments = newestHistory.uxAttachments;
      }
    }
    this.showEditInput = !this.showEditInput;
  }

  changeOption(draft: FeatureHistory) {
    this.selectedDraft = draft;
  }

  handleDescription(val: string) {
    this.description = val;
  }

  handleRelease(val: Issue) {
    this.release = val._id;
  }

  publishChange() {
    if (!this.selectedDraft) return;
    this.editFeature.emit({ id: this.selectedDraft._id, type: this.activeItem.id });
  }

  async handleAttahcments(e: { name: string; url: string }, type: string) {
    const url = await lastValueFrom(this.api.send<string>('signUrl', { url: e.url }));
    if (type === 'ux') {
      this.uxAttachments.push(url);
    } else {
      this.attachments.push(url);
    }
  }

  deleteAttahcments(e: any, type: string) {
    if (type === 'ux') {
      this.uxAttachments.splice(e, 1);
    } else {
      this.attachments.splice(e, 1);
    }
  }

  private prepareOptions(drafts: FeatureHistory[], type: 'draft' | 'production') {
    const allDrafts = drafts.map((ele) => ({
      ...ele,
      createdAt: `${this.datePipe.transform(ele.createdAt)} . ${ele.release.version}`,
    }));
    if (type === 'draft') {
      this.draftsHistoy = [...allDrafts] || [];
    } else {
      this.productionHistoy = [...allDrafts] || [];
    }
    if (this.items) {
      this.setActiveItem({ item: this.activeItem ? this.activeItem : this.items[0] });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetDraft'] && changes['resetDraft'].currentValue) {
      this.selectedDraft = null;
    }

    if (!changes['feature'] || !changes['feature'].currentValue) return;
    const feature = changes['feature'].currentValue as Feature;
    // console.log('feature[ngOnChanges]', feature);
    this.draftsHistoy = [];
    this.productionHistoy = [];
    if (feature.history) {
      const history = feature.history;
      this.prepareOptions(history, 'production');
    }
    if (feature.drafts) {
      const drafts = feature.drafts;
      this.prepareOptions(drafts, 'draft');
    }
  }

  setActiveItem(e: any) {
    this.activeItem = e.item;
    if (e.item.id === 'draft') {
      this.dropDownOptions = [...this.draftsHistoy];
    } else {
      this.dropDownOptions = [...this.productionHistoy];
    }
    this.selectedDraft = this.dropDownOptions[this.dropDownOptions.length - 1];
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Production', id: 'production', command: this.setActiveItem.bind(this) },
      { label: 'Draft', id: 'draft', command: this.setActiveItem.bind(this) },
    ];
    this.setActiveItem({ item: this.items[0] });
  }
}
