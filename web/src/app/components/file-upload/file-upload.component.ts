import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { lastValueFrom, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @ViewChild('primeFileUpload') primeFileUpload!: FileUpload;

  url = '';
  urls: string[] = [];
  uploadedFiles: any[] = [];

  constructor(private api: ApiService) {}

  uploader(files: File[]) {
    const file: File = files[0];
    const reader = new FileReader();
    let fileUrl = '';

    reader.addEventListener('load', () => {
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
        .subscribe({
          next: () => {
            this.urls.push(fileUrl);
          },
          error: (err) => console.log('err', err),
        });
    });

    reader.readAsDataURL(file);
  }

  progressReport($event: any) {
    this.primeFileUpload.progress = $event;
  }

  ngOnInit(): void {}
}
