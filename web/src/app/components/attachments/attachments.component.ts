import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { exelExt, imageExt, pdfExt, videoExt, wordExt } from '../../constants/attachmentsExtenstions';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent implements OnInit, OnChanges {
  @Input() attachments: string[] = [];

  images: string[] = [];
  videos: string[] = [];
  files: { url: string; icon: 'word' | 'pdf' | 'excel' }[] = [];

  constructor() {}

  private handleAttachments() {
    this.attachments.forEach((url) => {
      const ext = url.split('?')[0].split('.').pop() || '';
      if (wordExt.includes(ext)) {
        this.files.push({ url, icon: 'word' });
      } else if (pdfExt.includes(ext)) {
        this.files.push({ url, icon: 'pdf' });
      } else if (exelExt.includes(ext)) {
        this.files.push({ url, icon: 'excel' });
      } else {
        this.images.push(url);
      }
    });
  }

  openAttachments(url: string) {
    window.open(url);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['attachments'] && changes['attachments'].currentValue) {
      this.files = [];
      this.images = [];
      this.videos = [];
      this.handleAttachments();
    }
  }

  ngOnInit(): void {}
}
