import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml',
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string = '') {
    if (!value) return 'None';

    const doc = new DOMParser().parseFromString(value, 'text/html');
    const val = doc.documentElement.textContent || '';
    return this.sanitizer.bypassSecurityTrustHtml(val);
  }
}
