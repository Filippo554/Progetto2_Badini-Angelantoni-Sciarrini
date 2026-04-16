import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { Logo } from '../logo/logo';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
    selector: 'app-component-header',
    templateUrl: './header.html',
    styleUrl: './header.css',
    imports: [NgOptimizedImage, Logo],
})
export class HeaderComponent {
    themeService = inject(ThemeService);
    theme = (this.themeService.isDark()) ? 'dark' : 'light';
    toggle() {
        this.themeService.toggle();
        this.theme = (this.themeService.isDark()) ? 'dark' : 'light';
    }
    

    name = 'Roberto';
    surname = 'Carlos';
    togglelist() {
        
    }
}