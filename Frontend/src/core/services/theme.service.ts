import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly storageKey = 'theme';
    private dark = false;

    constructor() {
        const saved = localStorage.getItem(this.storageKey);

        if (saved === 'dark') {
            this.dark = true;
            document.documentElement.classList.add('dark');
        } else {
            this.dark = false;
            document.documentElement.classList.remove('dark');
        }
    }

    toggle() {
        this.dark = !this.dark;

        if (this.dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem(this.storageKey, 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem(this.storageKey, 'light');
        }
    }

    isDark(): boolean {
        return this.dark;
    }
}