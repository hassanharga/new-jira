import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
  release = '';

  constructor(private datePipe: DatePipe) {}

  editPage() {
    if (this.showEditInput) {
      if (!this.release) return;
      this.editFeature.emit({ description: escapeHtml(this.description), release: this.release });
      this.description = '';
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

  private prepareOptions(drafts: FeatureHistory[], type: 'draft' | 'production') {
    const allDrafts = drafts.map((ele) => ({
      ...ele,
      createdAt: this.datePipe.transform(ele.createdAt),
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
    console.log('ngOnChanges', changes);
    if (changes['resetDraft'] && changes['resetDraft'].currentValue) {
      this.selectedDraft = null;
    }

    if (!changes['feature'].currentValue) return;
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
