import { Component } from '@angular/core';

import { Page } from '../../shared/components/page/page';
import { Theme } from '../../shared/components/theme/theme';
import { Logo } from '../../shared/components/logo/logo';
import { GoogleButtonComponent } from '../../shared/components/google_button/google_button';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css',
    imports: [Page, GoogleButtonComponent, Theme, Logo]
})
export class Login {}
