import { Component, Input, inject } from "@angular/core";
import { OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { HeaderComponent } from "../header/header";
import { UserService } from "../../../../core/services/user.service";

@Component({
    selector: 'app-component-page',
    templateUrl: './page.html',
    styleUrl: './page.css',
    imports: [HeaderComponent],
})
export class Page implements OnInit{
    router = inject(Router);
    user = inject(UserService);
    ngOnInit() {
        if (!this.user.is && this.router.url !== '/login') {
            this.router.navigate(['/login']);
        }
    }
    @Input() headertype: string = "first";
}