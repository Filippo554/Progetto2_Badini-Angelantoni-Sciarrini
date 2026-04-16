import { Component, inject, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

import { Logo } from '../logo/logo';
import { ThemeService } from '../../../../core/services/theme.service';
import { Theme } from '../theme/theme';
import { UserService } from '../../../../core/services/user.service';
import { BackendSession } from '../../../../core/services/sessions.service';

@Component({
    selector: 'app-component-header',
    templateUrl: './header.html',
    styleUrl: './header.css',
    imports: [NgOptimizedImage, Logo, Theme],
})
export class HeaderComponent {
    @Input() type: string = "first";

    user = inject(UserService);
    themeService = inject(ThemeService);
    backendSession = inject(BackendSession);
    router = inject(Router);

    theme = (this.themeService.isDark()) ? 'dark' : 'light';
    cascadelist = "none";

    toggle() {
        this.themeService.toggle();
        this.theme = (this.themeService.isDark()) ? 'dark' : 'light';
    }

    togglelist() {
        this.cascadelist = this.cascadelist === "none" ? "block" : "none";
    }

    logout() {
        // pulisce sessione
        this.backendSession.clear();
        this.user.clear?.(); // se esiste

        // chiude menu
        this.cascadelist = "none";

        // redirect login
        this.router.navigate(['/login']);
    }

    get fullName(): string {
        return `${this.user.name} ${this.user.surname}`.trim();
    }
}