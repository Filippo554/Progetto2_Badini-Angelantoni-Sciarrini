import { Component, Input, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { HeaderComponent } from "../header/header";
import { BackendSession } from "../../../../core/services/sessions.service";

@Component({
    selector: 'app-component-page',
    templateUrl: './page.html',
    styleUrl: './page.css',
    imports: [HeaderComponent],
})
export class Page implements OnInit {
    router = inject(Router);
    backendSession = inject(BackendSession);

    @Input() headertype: string = "first";

    ngOnInit() {
        if (!this.backendSession.sessionToken && this.router.url !== '/login') {
            this.router.navigate(['/login']);
        }
    }
}