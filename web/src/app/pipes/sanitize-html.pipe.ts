import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { parseToHtml } from '../utils/excapeHtml';

@Pipe({
  name: 'sanitizeHtml',
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string = '') {
    if (!value) return 'None';

    const val = parseToHtml(value);
    return this.sanitizer.bypassSecurityTrustHtml(val);
  }
}
