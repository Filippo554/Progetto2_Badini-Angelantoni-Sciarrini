import { Component, inject } from "@angular/core";
import { ThemeService } from "../../../../core/services/theme.service";

@Component({
    selector: 'app-component-theme',
    templateUrl: './theme.html',
    styleUrl: './theme.css',
    imports: []
})
export class Theme {
    themeService = inject(ThemeService);
    theme = (this.themeService.isDark())? 'dark' : 'light';
    toggle() {
        this.themeService.toggle();
        this.theme = (this.themeService.isDark())? 'dark' : 'light';
    }
}