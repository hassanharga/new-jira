import { HttpEventType } from '@angular/common/http';
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

  @Input() type = '';

  @Output() uploadFile = new EventEmitter();
  @Output() isUploading = new EventEmitter(false);

  urls: { url: string; name: string }[] = [];
  uploadedFiles: any[] = [];

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
              return this.api.uploadImage(file, url);
            }),
          )
          .subscribe((event) => {
            switch (event.type) {
              // case HttpEventType.UploadProgress:
              //   let progress = Math.round((event.loaded / (event.total || 0)) * 100);
              //   console.log(`${file.name}`, progress);

              //   this.percentDone = progress + this.percentDone;
              //   console.log('this.percentDone', this.percentDone);
              //   // console.log('emitting: ' + (this.percentDone / this.totalPercent) * 100);
              //   this.primeFileUpload.onProgress.emit(Math.round((this.percentDone / this.totalPercent) * 100));

              //   break;
              case HttpEventType.Response:
                this.percentDone = this.percentDone + 100;
                this.primeFileUpload.onProgress.emit(Math.round((this.percentDone / this.totalPercent) * 100));
                const uploadedFile = { url: fileUrl, name: file.name };
                this.urls.push(uploadedFile);
                this.uploadFile.emit({ ...uploadedFile, type: this.type });
                this.uploadedFiles.push(file);
                // console.log('this.percentDone', this.percentDone);
                if (this.percentDone >= this.totalPercent) {
                  this.primeFileUpload.clear();
                  this.isUploading.emit(false);
                }
                break;
            }
          });
      }
    }
  }

  progressReport($event: any) {
    this.primeFileUpload.progress = $event;
  }

  ngOnInit(): void {}
}
