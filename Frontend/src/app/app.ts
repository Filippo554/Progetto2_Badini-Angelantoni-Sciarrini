import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { BackendSession } from '../core/services/sessions.service';
import { HttpService } from '../core/services/http.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private backendSession = inject(BackendSession);
  private http = inject(HttpService);
  private user = inject(UserService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    const token = this.backendSession.sessionToken;

    if (!token) {
      return;
    }

    try {
      const me = await this.http.authMe(token);
      this.user.init(me);
    } catch (error) {
      console.error('Sessione non valida:', error);
      this.backendSession.clear();
      this.user.clear();

      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    }
  }
}