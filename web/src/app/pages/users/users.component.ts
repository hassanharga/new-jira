import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  user: User | null = null;

  sub!: Subscription;

  constructor(private activeRoute: ActivatedRoute, private api: ApiService) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.activeRoute.queryParams
      .pipe(
        switchMap(({ user }) => {
          if (!user) return EMPTY;
          return this.api.send<User>('getUser', { id: user });
        }),
      )
      .subscribe({
        next: (user) => (this.user = user),
      });
  }
}
