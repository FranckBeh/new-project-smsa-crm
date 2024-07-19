import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../pages/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class NavService {

    public currentUrl = new BehaviorSubject<any>(undefined);

    constructor(private router: Router, private authService: AuthService) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.currentUrl.next(event.urlAfterRedirects);
            }
        });
    }

    isAdmin(): boolean {
      return this.authService.isAdmin();
    }
}
