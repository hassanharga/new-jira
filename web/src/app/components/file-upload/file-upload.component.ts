import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @ViewChild('primeFileUpload') primeFileUpload!: FileUpload;

  @Input() uploadedFiles: string[] = [];

  @Output() uploadFile = new EventEmitter();
  @Output() deleteFile = new EventEmitter();
  @Output() isUploading = new EventEmitter(false);

  totalPercent = 0;
  percentDone = 0;

  constructor(private api: ApiService) {}

  uploader(e: { files: File[] }) {
    this.primeFileUpload.onProgress.emit(0);
    if (e && e.files) {
      this.totalPercent = e.files.length * 100;
      this.percentDone = 25;
      this.primeFileUpload.onProgress.emit(Math.round((this.percentDone / this.totalPercent) * 100));
      this.isUploading.emit(true);
      for (const file of e.files) {
        let fileUrl = '';
        this.api
          .send<{ url: string }>('getSignedUrl', {
            fileType: file.type,
          })
          .pipe(
            switchMap(({ url }) => {
              fileUrl = url.split('?')[0];
              return this.api.uploadImage<null>(file, url);
            }),
          )
          .subscribe({
            next: () => {
              this.percentDone = this.percentDone + 100;
              this.primeFileUpload.onProgress.emit(Math.round((this.percentDone / this.totalPercent) * 100));
              const uploadedFile = { url: fileUrl, name: file.name };
              this.uploadFile.emit(uploadedFile);
              if (this.percentDone >= this.totalPercent) {
                this.primeFileUpload.clear();
                this.isUploading.emit(false);
              }
            },
          });
      }
    }
  }

  progressReport($event: any) {
    this.primeFileUpload.progress = $event;
  }

  deleteImage(i: number) {
    this.deleteFile.emit(i);
  }

  ngOnInit(): void {}
}
