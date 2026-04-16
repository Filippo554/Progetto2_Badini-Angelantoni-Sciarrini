import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Page } from '../../shared/components/page/page';

@Component({
    selector: 'app-error',
    templateUrl: './error.html',
    styleUrl: './error.css',
    imports: [Page],
})
export class Error implements OnInit {
    code = '';
    message = '';

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['code'] !== undefined)
                this.code = params['code'];
            else
                this.code = "Errore";
            if (params["message"] !== undefined)
                this.message = params['message'];
        });
    }
}