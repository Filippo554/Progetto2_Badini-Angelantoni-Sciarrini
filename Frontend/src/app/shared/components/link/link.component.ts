import { Component, Input, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-component-link',
    templateUrl: './link.component.html',
    styleUrl: './link.component.css',
    imports: []
})
export class LinkComponent {
    @Input() link: string = '';
    @Input() placeholder: string = 'link';
    @Input() width: string = "200";
    @Input() height: string = "50";
    router = inject(Router);

    haandleClick() {
        this.router.navigate([this.link]);
    }
}