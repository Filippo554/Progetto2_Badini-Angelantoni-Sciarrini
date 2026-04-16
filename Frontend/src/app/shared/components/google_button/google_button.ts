import { Component, AfterViewInit, ElementRef, ViewChild, inject } from "@angular/core";
import { Router } from "@angular/router";

import { SessionService } from "../../../../core/services/sessions.service";
import { UserService } from "../../../../core/services/user.service";
import { BackendSession } from "../../../../core/services/sessions.service";

declare const google: any;

@Component({
    selector: 'app-google-button',
    template: `<div #googleBtn></div>`,
    styleUrl: './google_button.css',
})
export class GoogleButtonComponent implements AfterViewInit {

    sessionService = inject(SessionService);
    user = inject(UserService);
    router = inject(Router);
    backendSession = inject(BackendSession);
    @ViewChild('googleBtn') googleBtn!: ElementRef;

    ngAfterViewInit() {
        const isDark = document.documentElement.classList.contains('dark');

        google.accounts.id.initialize({
            client_id: this.sessionService.get_client_id(),
            callback: (response: any) => {
                const credential = response.credential;
                console.log(credential);
                fetch('http://localhost:3000/api/v1/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential })
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Token JWT:', data.token);
                    this.backendSession.initialize(data.token);
                    console.log('Utente:', data.user);
                    this.user.init(data.user);
                    this.user.is = true;
                    this.router.navigate(['/']);
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