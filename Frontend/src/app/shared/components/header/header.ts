import { Component, inject, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { Logo } from '../logo/logo';
import { ThemeService } from '../../../../core/services/theme.service';
import { Theme } from '../theme/theme';
import { UserService } from '../../../../core/services/user.service';

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
    theme = (this.themeService.isDark()) ? 'dark' : 'light';
    toggle() {
        this.themeService.toggle();
        this.theme = (this.themeService.isDark()) ? 'dark' : 'light';
    }
    
    cascadelist = "none";
    name = this.user.name;
    surname = this.user.surname;
    
    togglelist() {
        if (this.cascadelist === "none") {
            this.cascadelist = "block";
        } else {
            this.cascadelist = "none";
        }
    }
}