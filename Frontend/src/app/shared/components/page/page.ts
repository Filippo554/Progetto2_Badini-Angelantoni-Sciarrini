import { Component } from "@angular/core";

import { HeaderComponent } from "../header/header";

@Component({
    selector: 'app-component-page',
    templateUrl: './page.html',
    styleUrl: './page.css',
    imports: [HeaderComponent],
})
export class Page {}