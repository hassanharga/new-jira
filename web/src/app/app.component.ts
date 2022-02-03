import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalizationService } from './services/localization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  sub!: Subscription;

  constructor(private translate: LocalizationService, private renderer: Renderer2) {}

  setHtmlLangAndDir() {
    this.sub = this.translate.lang.subscribe({
      next: ({ lang, dir }) => {
        this.renderer.setAttribute(document.querySelector('html'), 'dir', dir);
        this.renderer.setAttribute(document.querySelector('html'), 'lang', lang);
      },
    });
  }

  ngOnInit(): void {
    this.setHtmlLangAndDir();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
