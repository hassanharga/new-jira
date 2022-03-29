import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from './services/api.service';
import { IssueService } from './services/issue.service';
import { LocalizationService } from './services/localization.service';
import { User } from './types/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  sub!: Subscription;

  constructor(
    private translate: LocalizationService,
    private renderer: Renderer2,
    private api: ApiService,
    private issueService: IssueService,
  ) {
    this.translate.initTranslation();
  }

  setHtmlLangAndDir() {
    this.sub = this.translate.lang.subscribe({
      next: ({ lang, dir }) => {
        this.renderer.setAttribute(document.querySelector('html'), 'dir', dir);
        this.renderer.setAttribute(document.querySelector('html'), 'lang', lang);
      },
    });
  }

  // TODO remove user from here
  getUsers() {
    this.api.send<User[]>('getUsers', {}).subscribe({
      next: (res) => this.issueService.setUsers(res),
    });
  }

  ngOnInit(): void {
    this.setHtmlLangAndDir();
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
