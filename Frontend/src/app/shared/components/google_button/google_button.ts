import { Component, AfterViewInit, ElementRef, ViewChild, inject } from "@angular/core";
import { Router } from "@angular/router";

import { GoogleSession, BackendSession } from "../../../../core/services/sessions.service";
import { UserService } from "../../../../core/services/user.service";

declare const google: any;

@Component({
    selector: 'app-google-button',
    template: `<div #googleBtn></div>`,
    styleUrl: './google_button.css',
})
export class GoogleButtonComponent implements AfterViewInit {
    googleSession = inject(GoogleSession);
    backendSession = inject(BackendSession);
    user = inject(UserService);
    router = inject(Router);

    @ViewChild('googleBtn') googleBtn!: ElementRef;

    ngAfterViewInit() {
        const isDark = document.documentElement.classList.contains('dark');

        google.accounts.id.initialize({
            client_id: this.googleSession.sessionClientId,
            callback: (response: any) => {
                const credential = response.credential;
                this.googleSession.sessionCredentials = credential;

                fetch('http://localhost:3000/api/v1/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential })
                })
                .then(async res => {
                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Errore login');
                    }

                    return data;
                })
                .then(data => {
                    this.backendSession.initialize(data.token);
                    this.user.init(data.user);
                    this.router.navigate(['/home']);
                })
                .catch(err => console.error('Errore login:', err));
            }
        });

        google.accounts.id.renderButton(
            this.googleBtn.nativeElement,
            {
                theme: isDark ? 'filled_black' : 'outline',
                size: 'large',
                shape: 'pill',
                width: 400,
            }
        );
    }
}