import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Page } from '../../shared/components/page/page';
import { Theme } from '../../shared/components/theme/theme';
import { Logo } from '../../shared/components/logo/logo';
import { GoogleButtonComponent } from '../../shared/components/google_button/google_button';
import { BackendSession } from '../../../core/services/sessions.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css',
    imports: [Page, GoogleButtonComponent, Theme, Logo]
})
export class Login implements OnInit {
    private router = inject(Router);
    private backendSession = inject(BackendSession);

    ngOnInit(): void {
        if (this.backendSession.sessionToken) {
            this.router.navigate(['/home']);
        }
    }
}